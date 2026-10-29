"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, Upload, Copy, Check } from "lucide-react"
import Link from "next/link"
import { SlipUploader } from "./SlipUploader"

interface OrderItem {
    id: string
    quantity: number
    unitPrice: number
    product: { name: string }
    variant: { options: unknown } | null
}

interface Order {
    id: string
    orderNumber: string
    totalAmount: number
    status: string
    shippingName: string | null
    paymentSlipUrl: string | null
    items: OrderItem[]
}

// Your bank details — update these
const BANK_DETAILS = {
    bankName: "Commercial Bank of Ceylon",
    accountName: "Lenspect Studio",
    accountNumber: "1234567890",
    branch: "Negombo",
}

export function OrderConfirmationClient({ order }: { order: Order }) {
    const [copied, setCopied] = useState(false)

    function copyOrderNumber() {
        navigator.clipboard.writeText(order.orderNumber)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-12">
            {/* Success header */}
            <div className="text-center mb-10">
                <div
                    style={{ width: "4rem", height: "4rem", borderRadius: "9999px", backgroundColor: "#EDF0EB", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}
                >
                    <CheckCircle className="h-8 w-8" style={{ color: "#A3B19B" }} />
                </div>
                <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#22252A" }} className="text-2xl font-bold mb-2">
                    Order Placed!
                </h1>
                <p style={{ color: "#6B7280", fontFamily: "Inter, sans-serif" }} className="text-sm">
                    Thank you{order.shippingName ? `, ${order.shippingName}` : ""}. Complete your payment to begin production.
                </p>
            </div>

            {/* Order number */}
            <div
                className="flex items-center justify-between p-4 rounded-xl mb-5"
                style={{ backgroundColor: "#FFFFFF", border: "1.5px solid #D9826C33" }}
            >
                <div>
                    <p className="text-xs mb-0.5" style={{ color: "#6B7280", fontFamily: "Inter, sans-serif" }}>Order Number</p>
                    <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#22252A" }} className="text-lg font-bold">
                        {order.orderNumber}
                    </p>
                </div>
                <button onClick={copyOrderNumber} className="flex items-center gap-1.5 text-sm" style={{ color: "#D9826C", fontFamily: "Inter, sans-serif" }}>
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? "Copied!" : "Copy"}
                </button>
            </div>

            {/* Order items */}
            <div className="p-5 rounded-xl mb-5" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E8E4DE" }}>
                <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#22252A" }} className="font-semibold mb-3">
                    Items Ordered
                </h2>
                <div className="space-y-2">
                    {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                            <span style={{ color: "#6B7280", fontFamily: "Inter, sans-serif" }}>
                                {item.product.name} × {item.quantity}
                            </span>
                            <span style={{ color: "#22252A", fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="font-medium">
                                LKR {(item.unitPrice * item.quantity).toLocaleString()}
                            </span>
                        </div>
                    ))}
                    <div style={{ borderTop: "1px solid #E8E4DE", paddingTop: "0.75rem", marginTop: "0.75rem" }} className="flex justify-between">
                        <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#22252A" }} className="font-semibold">Total</span>
                        <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#D9826C" }} className="font-bold">
                            LKR {order.totalAmount.toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>

            {/* Bank details */}
            <div className="p-5 rounded-xl mb-5" style={{ backgroundColor: "#EDF0EB", border: "1px solid #A3B19B33" }}>
                <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#22252A" }} className="font-semibold mb-3">
                    Bank Transfer Details
                </h2>
                <div className="space-y-2 text-sm">
                    {Object.entries(BANK_DETAILS).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                            <span style={{ color: "#6B7280", fontFamily: "Inter, sans-serif", textTransform: "capitalize" }}>
                                {key.replace(/([A-Z])/g, " $1")}
                            </span>
                            <span style={{ color: "#22252A", fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="font-semibold">
                                {value}
                            </span>
                        </div>
                    ))}
                    <div className="flex justify-between pt-2" style={{ borderTop: "1px solid #A3B19B44" }}>
                        <span style={{ color: "#6B7280", fontFamily: "Inter, sans-serif" }}>Amount to transfer</span>
                        <span style={{ color: "#D9826C", fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="font-bold">
                            LKR {order.totalAmount.toLocaleString()}
                        </span>
                    </div>
                </div>
                <p className="text-xs mt-3" style={{ color: "#6B7280", fontFamily: "Inter, sans-serif" }}>
                    Include your order number <strong>{order.orderNumber}</strong> in the transfer reference.
                </p>
            </div>

            <div className="p-5 rounded-xl mb-8" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E8E4DE" }}>
                <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#22252A" }} className="font-semibold mb-2">
                    Upload Payment Slip
                </h2>
                <p className="text-sm mb-4" style={{ color: "#6B7280", fontFamily: "Inter, sans-serif" }}>
                    After transferring, upload your payment slip so we can verify and begin printing.
                </p>
                <SlipUploader
                    orderNumber={order.orderNumber}
                    existingSlipUrl={order.paymentSlipUrl}
                />
            </div>

            <div className="flex gap-3">
                <Button asChild className="flex-1">
                    <Link href="/products">Continue Shopping</Link>
                </Button>
                <Button variant="outline" asChild className="flex-1">
                    <Link href="/customer/orders">My Orders</Link>
                </Button>
            </div>
        </div>
    )
}