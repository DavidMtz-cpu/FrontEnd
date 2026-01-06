import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ChatMessageComponent, MyMessageComponent, TypingLoaderComponent, TextMessageBoxComponent } from '@components/index';
import { Message } from '@interfaces/message.interfaces';
import { OpenAiService } from 'app/presentation/services/openai.service';

@Component({
  selector: 'app-image-generation-page',
  standalone: true,
  imports: [
    CommonModule,
    ChatMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxComponent,
  ],
  templateUrl: './imageGenerationPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ImageGenerationPageComponent {
  public messages = signal<Message[]>([]);
  public isLoading = signal(false)

  public openAiService = inject(OpenAiService);

  constructor(private sanitizer: DomSanitizer) {}

  handleMessage( prompt: string ) {
    this.isLoading.set(true);
    this.messages.update( prev => [ 
      ...prev, 
      {
        isGpt: false,
        text: prompt,
      }]);

    this.openAiService.imageGeneration( prompt ).subscribe( resp => {
      
      this.sanitizer.bypassSecurityTrustUrl(resp!.url);

      this.isLoading.set(false);
      
      if( !resp ) return;


      this.messages.update( prev => [
        ...prev, 
        {
          isGpt: true,
          text: resp.alt,
          imageInfo: resp,
        }
      ]);


    })
  }
}
