import { BadRequestException, Injectable } from "@nestjs/common";

@Injectable()
export class OffsetPipe {
    private minOffset = 0;
    private maxOffset = 1000;

    
    transform(value: any) {
        if(value === undefined || value === null || value === '') {
            return
        }
        try {
            value = parseInt(value);
            if(isNaN(value)) {
                throw new BadRequestException('Offset must be a number');
            }
        } catch(e) {
            throw new BadRequestException('Offset must be a number');
        }

        if(typeof value !== 'number') {
            throw new BadRequestException('Offset must be a number');
        }
        if(value < this.minOffset) {
            throw new BadRequestException('Offset must be greater than 0');
        }
    
    
        return value;
    }
}