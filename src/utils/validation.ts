export function validatePassword(pw: string): {
  valid: boolean;
  reasons: string[];
} {
  const reasons: string[] = [];

  if (pw.length < 8) {
    reasons.push("パスワードは8文字以上である必要があります");
  }

  const hasUpper = /[A-Z]/.test(pw);
  const hasLower = /[a-z]/.test(pw);
  const hasDigit = /[0-9]/.test(pw);
  const hasSymbol = /[@_\-!?.]/.test(pw);

  const count = [hasUpper, hasLower, hasDigit, hasSymbol].filter(
    Boolean
  ).length;
  if (count < 3) {
    reasons.push(
      "大文字・小文字・数字・記号(@_-!?.) のうち3種類以上を含めてください"
    );
  }

  return { valid: reasons.length === 0, reasons };
}

export default validatePassword;
