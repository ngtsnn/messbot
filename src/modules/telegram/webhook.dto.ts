export interface TeleMessageBody {
  update_id: number;
  message: {
    message_id: number;
    from: {
      id: number;
      is_bot: boolean;
      first_name: string;
      last_name: string;
      language_code: 'en';
    };
    chat: {
      id: number;
      first_name: string;
      last_name: string;
      type: 'private' | 'public';
    };
    date: number;
    text: string;
  };
}

export interface ISendMessage {
  id: number;
  text: string;
  parseMode?: string;
}
