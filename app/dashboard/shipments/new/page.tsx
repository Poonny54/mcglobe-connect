import { createServerClient } from "@/lib/supabase/server"
import NewShipmentForm from "./NewShipmentForm"

export default async function NewShipmentPage() {
  const supabase = await createServerClient()

  const { data: customers, error } = await supabase
    .from("customers")
    .select("id, company_name")
    .order("company_name")

  console.log("CUSTOMERS:", customers)
  console.log("ERROR:", error)

  return <NewShipmentForm customers={customers ?? []} />
}
