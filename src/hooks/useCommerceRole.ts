import { useAuthStore } from '@/store';
import type { AgentType } from '@/types/commerce';

export function useCommerceRole() {
  const { agent } = useAuthStore();
  const role = (agent as any)?.agentType as AgentType | undefined;
  const isMerchant = role === 'MERCHANT';
  const isCustomer = role === 'CUSTOMER';

  return {
    role,
    isMerchant,
    isCustomer,
    hasRole: Boolean(role),
  };
}
