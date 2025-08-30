export class SendMessageDto {
  senderId: string;
  chatId: string;
  ciphertext: string;
  iv: string;
  authTag: string;
}
