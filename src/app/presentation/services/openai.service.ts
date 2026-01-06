import { Injectable } from '@angular/core';
import { audioToTextUseCase, createThreadUseCase, imageGenerationUseCase, orthographyUseCase, prosConsStreamUseCase, prosCosnUseCase, textToAudioUseCase, translateUseCase } from '@user-cases/index';
import { Observable, from, of,tap } from 'rxjs';
import { postQuestionUseCae } from '../../core/use-cases/assistant/postQuestionUseCase';

@Injectable({providedIn: 'root'})
export class OpenAiService {


    checkOrthography(prompt: string) {
        return from( orthographyUseCase(prompt));
    };

    prosCons( prompt: string) {
        return from(prosCosnUseCase(prompt))
    }

    prosConsStream( prompt: string, abortSignal: AbortSignal) {
        return prosConsStreamUseCase(prompt,abortSignal)
    }

    translateText( prompt: string, lang:string ) {
        return from( translateUseCase(prompt,lang))
    };

    textToAudio(prompt: string, voice: string) {
        return from(textToAudioUseCase(prompt,voice))
    };

    audioToText(file: File,prompt: string) {
        return from(audioToTextUseCase(file,prompt))
    };

    imageGeneration(prompt: string,originalImage?: string,maskImage?: string) {
        return from( imageGenerationUseCase(prompt,originalImage,maskImage) )
    };

    createThread(): Observable<string> {
        if( localStorage.getItem('thread') ) {
            return of(localStorage.getItem('thread')!)
        };
        return from( createThreadUseCase() ).pipe(
            tap((thread) => {
                localStorage.setItem('thread',thread)
            })
        );
    };

    postQuestion( threadId: string,question: string ) {
        return from(postQuestionUseCae(threadId,question))
    }

}