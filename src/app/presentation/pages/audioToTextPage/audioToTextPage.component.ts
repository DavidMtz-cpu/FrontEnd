import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ChatMessageComponent, MyMessageComponent, TypingLoaderComponent, TextMessageBoxComponent, TextMessageEvent, TextMessageBoxFileComponent } from '@components/index';
import { AudioToTextResponse } from '@interfaces/index';
import { Message } from '@interfaces/message.interfaces';
import { OpenAiService } from 'app/presentation/services/openai.service';

@Component({
  selector: 'app-audio-to-text-page',
  standalone: true,
  imports: [
    CommonModule,
    ChatMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxFileComponent
  ],
  templateUrl: './audioToTextPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AudioToTextPageComponent {
  public messages = signal<Message[]>([]);
  public isLoading = signal(false)

  public openAiService = inject(OpenAiService)



  handleMessageWithFile( {prompt,file}: TextMessageEvent ) {

    const text = prompt ?? file.name ?? 'Traduce el Audio';
    this.isLoading.set(true);

    this.messages.update( prev => [ ...prev, { isGpt: false, text: text } ]);

    this.openAiService.audioToText( file,text ).subscribe( resp => this.handleResponse(resp))

  };

  handleResponse(resp:AudioToTextResponse | null) {
    this.isLoading.set(false);
    if( !resp ) return;

    const text = `##Transcription:
    __Duracion:__ ${Math.round(resp.duration)} segundos.

    ##El texto es:
    ${resp.text}`;

    this.messages.update( prev => [ ...prev, {isGpt: true,text:text} ]);

    for (const segments of resp.segments) {
      const segmentMessage = `
      __De: ${Math.round(segments.start)} a ${ Math.round(segments.end)} segundos.__

      ${segments.text}`;

      this.messages.update( prev => [ ...prev, {isGpt: true,text:segmentMessage} ]);
    }


  }
}
