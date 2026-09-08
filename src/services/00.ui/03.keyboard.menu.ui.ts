import { Bot, Context, InlineKeyboard, SessionFlavor, session } from "grammy";
export class MenuKeyboard {
  readonly welcomeText = `Welcome aboard! 🚀 I'm your all-in-one AI assistant, ready to help you create, generate, and explore without limits.

        Here is everything you can do with me right at your fingertips:

        ⭐ Stars Balance: Check your current balance and rewards instantly.

        ✍️ AI Content: Generate engaging text, copy, articles, or ideas in seconds.

        🖼 AI Image: Transform your imagination into stunning visual artwork.

        🎬 AI Video: Bring dynamic video concepts to life effortlessly.

        💳 Top up Stars: Top up your balance anytime to keep the creativity flowing.

        📜 History: Review your past prompts, generations, and activities.

        Tap any option below or type your request to get started! Let's build something amazing together. ✨`;
  btnMenu(): InlineKeyboard {
    return new InlineKeyboard()
      .text("⭐ Stars Balance", "btn_star_balance")
      .text("✍️ AI Content", "btn_ai_content")
      .row()
      .text("🎨 AI Image", "btn_ai_image")
      .text("🎬 AI Video", "btn_ai_video")
      .row()
      .text("💳 Top up Stars", "btn_buy_star")
      .text("📜 History", "btn_history_star");
  }
  btnConfirmBuy(): InlineKeyboard {
    return new InlineKeyboard()
      .text("Confirm", "btn_confirm_buy")
      .text("Cancel", "btn_cancel_buy");
  }
  btnAiVideo(): InlineKeyboard {
    return new InlineKeyboard()
      .text("Cut Video", "btn_cut_video")
      .text("Generate Video", "btn_generate_video")
      .row()
      .text("Home Page", "btn_home");
  }
}
