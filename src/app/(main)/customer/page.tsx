'use client';

import { useEffect } from 'react';
import { useOrderStore, useOfferStore } from '@/store/commerce';
import { Card, CardHeader, CardTitle, CardContent, Button, Spinner } from '@/components/ui';
import { ShoppingCart, MessageSquare, Package } from 'lucide-react';
import Link from 'next/link';

export default function CustomerDashboard() {
  const { orders, loadMyOrders, isLoading: ordersLoading } = useOrderStore();
  const { offers, loadMyOffers, isLoading: offersLoading } = useOfferStore();

  useEffect(() => {
    loadMyOrders(true);
    loadMyOffers(true);
  }, []);

  const pendingOffers = offers.filter(o => o.status === 'PENDING');
  const acceptedOffers = offers.filter(o => o.status === 'ACCEPTED');
  const recentOrders = orders.slice(0, 5);

  if (ordersLoading || offersLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Customer Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Track your orders and offers
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <ShoppingCart className="h-4 w-4" />
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
            <Link href="/customer/orders">
              <p className="text-sm text-primary hover:underline">View all orders</p>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <MessageSquare className="h-4 w-4" />
              Pending Offers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOffers.length}</div>
            <Link href="/customer/offers">
              <p className="text-sm text-primary hover:underline">View all offers</p>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Package className="h-4 w-4" />
              Accepted Offers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{acceptedOffers.length}</div>
            <p className="text-sm text-muted-foreground">Ready to purchase</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Recent Orders</h2>
          <Link href="/customer/orders">
            <Button variant="ghost">View All</Button>
          </Link>
        </div>

        {recentOrders.length > 0 ? (
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <Link key={order.id} href={`/customer/orders/${order.id}`}>
                <Card className="transition-shadow hover:shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{order.listing.product.title}</p>
                        <p className="text-sm text-muted-foreground">
                          Order #{order.id.slice(0, 8)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">
                          ${(order.priceCents / 100).toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground">{order.status}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <ShoppingCart className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">No orders yet</p>
              <Link href="/marketplace">
                <Button className="mt-4">Browse Marketplace</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
