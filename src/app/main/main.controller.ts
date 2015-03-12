/// <reference path='../objects/Team/Team.ts' />
/// <reference path='../objects/Tournament/Tournament.ts' />

module tourneyTracker {

    export interface IMainScope extends ng.IScope {
        teams: Array<ITeam>;
        addTeam(name: string);
        removeTeam(team: Team);
        exp2(num: number); // 2^x
        createMatchTree(): void;
        levels: Array<Array<Match>>;
        saveTournament(): void;
        loadTournament(): void;
        data: string;
    }

    export class MainCtrl {
        private tournament: Tournament;
        public matchUnitSize: number;
        public teamHeight: number;
        public spacingValue: number;
        /* @ngInject */
        constructor(private $scope: IMainScope) {
            this.tournament = new Tournament();
            this.teamHeight = 30;
            this.spacingValue = 8;
            this.matchUnitSize = this.teamHeight * 2 + this.spacingValue;

            $scope.saveTournament = this.saveTournament.bind(this);
            $scope.loadTournament = this.loadTournament.bind(this);
            $scope.exp2 = (num) => Math.pow(2, num);
            $scope.addTeam = this.addTeam.bind(this);
            $scope.removeTeam = this.removeTeam.bind(this);
            $scope.createMatchTree = this.createMatchTree.bind(this);
            for (var i = 1; i <= 29; ++i) {
                this.tournament.addTeam('team' + i);
            }
            $scope.teams = this.tournament.getTeams();
            this.createMatchTree();
        }
        public saveTournament(): void {
            var data: string = this.tournament.serialize();
            this.$scope.data = data;
            console.log(data);
        }
        public loadTournament(): void {
            this.tournament.deserialize(this.$scope.data);
        }

        public createMatchTree(): void {
            this.$scope.levels = this.tournament.createMatchTree();
        }

        public addTeam(name: string): void {
            this.tournament.addTeam(name);
            this.$scope.teams = this.tournament.getTeams();
        }

        public removeTeam(team: Team): void {
            this.tournament.removeTeam(team);
            this.$scope.teams = this.tournament.getTeams();
        }
    }
}
