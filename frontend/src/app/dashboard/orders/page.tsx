"use client";

import { Navbar } from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useMyOrders } from "@/hooks/use-order";
import { format } from "date-fns";
import Link from "next/link";

export default function UserOrdersPage() {
  const { data: orders, isLoading, error } = useMyOrders();

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Orders</h1>
          <p className="text-foreground/60 mt-1">
            Track your recent purchases and their status.
          </p>
        </div>

        {isLoading && (
          <div className="py-16 text-center text-foreground/60">
            Loading your orders...
          </div>
        )}

        {error && (
          <div className="py-16 text-center text-red-500">
            {error.message || "Failed to load orders."}
          </div>
        )}

        {!isLoading && !error && (!orders || orders.length === 0) && (
          <div className="py-16 text-center text-foreground/60">
            <p className="mb-3">You don&apos;t have any orders yet.</p>
            <Link
              href="/shop"
              className="text-primary font-medium hover:text-primary/80"
            >
              Start shopping →
            </Link>
          </div>
        )}

        {!isLoading && !error && orders && orders.length > 0 && (
          <Card className="border border-border/60 bg-card/40">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/60 bg-muted/40">
                      <th className="px-6 py-3 text-left text-foreground/60 font-semibold">
                        Order
                      </th>
                      <th className="px-6 py-3 text-left text-foreground/60 font-semibold">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-foreground/60 font-semibold">
                        Items
                      </th>
                      <th className="px-6 py-3 text-left text-foreground/60 font-semibold">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-foreground/60 font-semibold">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr
                        key={order._id}
                        className="border-b border-border/40 hover:bg-muted/40 transition-colors"
                      >
                        <td className="px-6 py-4 font-mono text-xs text-foreground">
                          #{order._id.slice(-8)}
                        </td>
                        <td className="px-6 py-4 text-foreground/80">
                          {format(new Date(order.createdAt), "MMM dd, yyyy")}
                        </td>
                        <td className="px-6 py-4 text-foreground/80">
                          {order.items.length}
                        </td>
                        <td className="px-6 py-4 text-foreground font-semibold">
                          ₦{order.total.toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className="capitalize">
                            {order.status.replace("_", " ")}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}

