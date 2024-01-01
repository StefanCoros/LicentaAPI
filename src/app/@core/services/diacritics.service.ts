import { Injectable } from '@nestjs/common';

@Injectable()
export class DiacriticsService {
  replaceDiacriticsWithAnalogLetters = (text) => {
    return (
      text
        .replace(/ă/g, 'a')
        .replace(/Ă/g, 'A')
        .replace(/â/g, 'a')
        .replace(/Â/g, 'A')
        .replace(/î/g, 'i')
        .replace(/Î/g, 'I')
        /** WINDOWS codes */
        // 351
        .replace(/ş/g, 's')
        // 350
        .replace(/Ş/g, 'S')
        // 355
        .replace(/ţ/g, 't')
        // 354
        .replace(/Ţ/g, 'T')
        /** UNIX codes */
        // 537
        .replace(/ș/g, 's')
        // 536
        .replace(/Ș/g, 'S')
        // 539
        .replace(/ț/g, 't')
        // 538
        .replace(/Ț/g, 'T')
    );
  };
}
