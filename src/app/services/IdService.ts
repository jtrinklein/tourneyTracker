/// <reference path='./IIdService.d.ts' />

module tourneyTracker {
    export class IdService implements IIdService {
        private nextId: number;
        constructor() {
            this.nextId = new Date().getTime();
        }

        public getId(): string {
            var id: string = this.nextId.toString();
            this.nextId++;
            return id;
        }
    }
}
