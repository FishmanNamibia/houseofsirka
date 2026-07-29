import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text } from "@medusajs/ui"

/**
 * Branded header on the orders list.
 *
 * Medusa's admin branding is genuinely limited: widgets and custom pages are
 * supported, but the login screen, the sidebar logo and the browser title come
 * from the packaged dashboard build and cannot be replaced without forking it.
 * What can be done is put House of Sirka in front of whoever opens the admin,
 * with the shop's own colours.
 */
const BrandHeader = () => {
  return (
    <Container className="mb-4 overflow-hidden p-0">
      <div
        className="flex flex-wrap items-center justify-between gap-4 px-6 py-5"
        style={{ background: "#561026" }}
      >
        <div>
          <Text
            size="xsmall"
            weight="plus"
            style={{ color: "rgba(255,255,255,0.7)", letterSpacing: "0.14em", textTransform: "uppercase" }}
          >
            House of Sirka
          </Text>
          <Heading level="h2" style={{ color: "#ffffff", marginTop: 4 }}>
            Workroom control
          </Heading>
          <Text size="small" style={{ color: "rgba(255,255,255,0.85)", marginTop: 4 }}>
            Windhoek · prices in Namibian dollars · payment confirmed by hand
          </Text>
        </div>

        <a
          href="http://localhost:3080"
          target="_blank"
          rel="noreferrer"
          style={{
            background: "#F2B84B",
            color: "#151413",
            borderRadius: 6,
            padding: "10px 18px",
            fontWeight: 600,
            fontSize: 14,
            textDecoration: "none",
          }}
        >
          View the storefront
        </a>
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "order.list.before",
})

export default BrandHeader
