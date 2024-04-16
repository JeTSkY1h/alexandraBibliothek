import { BadRequestException, Injectable } from "@nestjs/common";
import { min } from "class-validator";

@Injectable()
export class LimitPipe {
    private minLimit = 0;
    private maxLimit = 1000;

    
    transform(value: any) {
        try {
            value = parseInt(value);
            if(isNaN(value)) {
                throw new BadRequestException('Limit must be a number');
            }
        } catch(e) {
            throw new BadRequestException('Limit must be a number');
        }

        if(typeof value !== 'number') {
            throw new BadRequestException('Limit must be a number');
        }
        if(value < this.minLimit) {
            throw new BadRequestException('Limit must be greater than 0');
        }
        if(value > this.maxLimit) {
            throw new BadRequestException('Limit must be less than 100');
        }
    
        return value;
    }
}