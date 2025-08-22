import LoginButton from "@/features/auth/components/login/LoginButton";
import {render, screen} from "@testing-library/react";
import '@testing-library/jest-dom';

jest.mock('@/utils/validatePhone', () => ({
  isValidBrazilianMobile: jest.fn(),
}))

import {isValidBrazilianMobile} from "@/utils/validatePhone";

describe('LoginButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('button do not render if phoneNumber is empty', () => {
    render(<LoginButton isValid={false} isPending={false} phoneNumber='' error={null} />);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('enable button when isValid is true', () => {
    (isValidBrazilianMobile as jest.Mock).mockReturnValue(true);
    render(<LoginButton isValid={true} isPending={false} phoneNumber='21973433936' error={null}/>)
    const button = screen.getByRole('button', {name: /entrar/i})
    expect(button).toBeEnabled();
  })
})
