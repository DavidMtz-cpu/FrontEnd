import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ChatMessageComponent, MyMessageComponent, TypingLoaderComponent, TextMessageBoxComponent } from '@components/index';
import { Message } from '@interfaces/message.interfaces';
import { OpenAiService } from 'app/presentation/services/openai.service';

@Component({
  selector: 'app-pros-cons-stream-page',
  standalone: true,
  imports: [
  
    ChatMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxComponent,
  ],
  templateUrl: './prosConsStreamPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProsConsStreamPageComponent {
  public messages = signal<Message[]>([]);
  public isLoading = signal(false);

  public openAiService = inject(OpenAiService);

  public abortSignal = new AbortController() 


  async handleMessage( promt: string ) {

    this.abortSignal.abort();
    this.abortSignal = new AbortController()

    this.messages.update( prev => [
      ...prev,
      {
        isGpt: false,
        text: promt
      },
      {
        isGpt: true,
        text: '...'
      }
    ]);

    this.isLoading.set(true)
    const stream = this.openAiService.prosConsStream(promt,this.abortSignal.signal);
    this.isLoading.set(false)

    for await (const text of stream) {
      this.handleMessageStream(text)
    };
  }

  handleMessageStream(message: string) {
    this.messages().pop();
    const messages = this.messages();

    this.messages.set([ ...messages, { isGpt: true, text: message } ])
  }


}
