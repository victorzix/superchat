import { VALID_BRAZILIAN_DDDS } from '@/constants/valid-ddds';

export function isValidBrazilianMobile(phone: string) {
	if (phone) {
		const ddd = phone.slice(0, 2);
		const ninthDigit = phone[2];

		return VALID_BRAZILIAN_DDDS.includes(ddd) && ninthDigit === '9';
	} else {
		return false;
	}
}
