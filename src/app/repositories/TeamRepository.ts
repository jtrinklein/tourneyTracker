/// <reference path='../objects/Team/Team.ts' />

module tourneyTracker {
    export class TeamRepository {
        private lastId: number;
        private teams: Map<string, ITeam>;

        constructor() {
            this.lastId = new Date().getTime();
            this.teams = new Map<string, ITeam>();
        }

        public get(id: string): ITeam {
            return angular.copy(this.teams[id]);
        }

        public put(team: ITeam): void {
            if(team) {
                this.teams[team.id] = angular.copy(team);
            }
        }

        public create(): ITeam {
            var team: ITeam = new Team();
            team.id = this.nextId();
            return team;
        }

        private nextId(): string {
            this.lastId++
            return this.lastId.toString();
        }
    }
}
