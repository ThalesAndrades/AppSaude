export async function listUserEntitlements() {
  return [
    { productId: 'jornada', activatedAt: new Date() },
    { productId: 'mentoria', activatedAt: new Date() },
    { productId: 'bundle', activatedAt: new Date() },
  ];
}
export async function userHasEntitlement() {
  return true;
}
export async function listRecentPurchases() {
  return [];
}