// Swish Business API integration (requires Swish merchant certificate + agreement)
// Setup: obtain certificate from your bank, set SWISH_MERCHANT_NUMBER and cert paths in env
//
// Environment variables needed:
//   SWISH_MERCHANT_NUMBER   — your 10-digit Swish merchant number (e.g. "1234679304")
//   SWISH_CERTIFICATE_PATH  — path to the .p12 / .pem mTLS certificate from your bank
//   SWISH_CERTIFICATE_PASS  — passphrase for the certificate (if required)

export const SWISH_MERCHANT_NUMBER = process.env.SWISH_MERCHANT_NUMBER || ""

export const SWISH_API_URL =
  process.env.NODE_ENV === "production"
    ? "https://cpc.getswish.net/swish-cpcapi/api/v2"
    : "https://mss.cpc.getswish.net/swish-cpcapi/api/v2" // Swish test environment

export type SwishPaymentStatus =
  | "CREATED"
  | "PAID"
  | "DECLINED"
  | "ERROR"
  | "CANCELLED"

export type SwishPaymentRequestCallback = {
  id: string
  payeePaymentReference: string   // our orderId
  paymentReference: string        // Swish transaction reference
  callbackUrl: string
  payerAlias: string              // customer's Swish number
  payeeAlias: string              // merchant's Swish number
  currency: "SEK"
  message: string
  status: SwishPaymentStatus
  amount: number                  // in SEK
  datePaid?: string               // ISO 8601
  errorCode?: string
  errorMessage?: string
}

export type CreateSwishPaymentRequestParams = {
  amount: number        // in SEK (not öre)
  orderId: string
  callbackUrl: string
  payerAlias?: string   // customer's Swish number — optional for QR flow
  message?: string
}

/**
 * Create a Swish payment request.
 *
 * In production this must use mTLS with the merchant certificate.
 * The certificate can be loaded via:
 *   const cert = fs.readFileSync(process.env.SWISH_CERTIFICATE_PATH!)
 *   const agent = new https.Agent({ pfx: cert, passphrase: process.env.SWISH_CERTIFICATE_PASS })
 *   fetch(url, { agent, ... })
 *
 * Returns the Swish payment request ID (UUID) which is used to check status
 * or present a QR code to the customer.
 */
export async function createSwishPaymentRequest(
  params: CreateSwishPaymentRequestParams
): Promise<{ id: string; error?: never } | { id?: never; error: string }> {
  if (!SWISH_MERCHANT_NUMBER) {
    return { error: "SWISH_MERCHANT_NUMBER is not configured" }
  }

  // TODO: load mTLS cert and create an https.Agent for production
  // const cert = fs.readFileSync(process.env.SWISH_CERTIFICATE_PATH!)
  // const httpsAgent = new https.Agent({ pfx: cert, passphrase: process.env.SWISH_CERTIFICATE_PASS })

  const instructionUUID = crypto.randomUUID().toUpperCase().replace(/-/g, "")

  const body = {
    payeePaymentReference: params.orderId,
    callbackUrl: params.callbackUrl,
    payeeAlias: SWISH_MERCHANT_NUMBER,
    currency: "SEK",
    amount: params.amount,
    message: params.message ?? `Bestellung ${params.orderId.slice(0, 8)}`,
    ...(params.payerAlias ? { payerAlias: params.payerAlias } : {}),
  }

  try {
    const response = await fetch(
      `${SWISH_API_URL}/paymentrequests/${instructionUUID}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        // agent: httpsAgent  // needed in production
      }
    )

    if (response.status === 201) {
      return { id: instructionUUID }
    }

    const text = await response.text()
    return { error: `Swish API error ${response.status}: ${text}` }
  } catch (err) {
    return { error: `Swish request failed: ${String(err)}` }
  }
}

/**
 * Retrieve the status of an existing Swish payment request.
 */
export async function getSwishPaymentStatus(
  paymentRequestId: string
): Promise<{ status: SwishPaymentStatus; error?: never } | { status?: never; error: string }> {
  try {
    const response = await fetch(
      `${SWISH_API_URL}/paymentrequests/${paymentRequestId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        // agent: httpsAgent
      }
    )

    if (!response.ok) {
      return { error: `Swish status check failed: ${response.status}` }
    }

    const data = (await response.json()) as SwishPaymentRequestCallback
    return { status: data.status }
  } catch (err) {
    return { error: `Swish status check error: ${String(err)}` }
  }
}
