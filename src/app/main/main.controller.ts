/// <reference path='./Team/Team.ts' />

module tourneyTracker {
    export class Match {
        public teamA: Team;
        public teamB: Team;
        public winner: Team;
        public loser: Team;
        public parent: Match;
        public leftChild: Match;
        public rightChild: Match;

        constructor(teamA?: Team, teamB?: Team) {
            this.teamA = teamA;
            this.teamB = teamB;

        }

        private getTeamName(team: Team): string {
            return !!team ? team.name : '???';
        }
        public getTeamNameA(): string {
            return this.getTeamName(this.teamA);
        }


        public getTeamNameB(): string {
            return this.getTeamName(this.teamB);
        }

        public setLeftChild(match: Match): void {
            match.parent = this;
            this.leftChild = match;
            this.teamA = match.winner;
        }

        public setRightChild(match: Match): void {
            match.parent = this;
            this.rightChild = match;
            this.teamB = match.winner;
        }
    }
    export interface IMainScope extends ng.IScope {
        teams: Array<Team>;
        addTeam(name: string);
        matches: Array<Match>;
        createMatchTree(): void;
        levels: Array<Array<Match>>;
    }

    export class MainCtrl {
        /* @ngInject */
        constructor(private $scope: IMainScope) {
            var _this: MainCtrl = this;
            $scope.teams = new Array<Team>();
            $scope.matches = new Array<Match>();
            $scope.addTeam = (name: string) => { _this.addTeam(name); };
            $scope.createMatchTree = () => { _this.createMatchTree(); };
        }

        public generateBaseMatches(): void {
            var last: Team = null;
            var matches: Array<Match> = [];
            this.$scope.teams.reduce((match: Match, team: Team): Match =>  {
                if (!match.teamA) {
                    match.teamA = team;
                } else {
                    match.teamB = team;
                    matches.push(match);
                    match = new Match();
                }
                return match;
            }, new Match());

            this.$scope.matches = matches;
        }

        public createMatchTree(): void {
            var levels: Array<Array<Match>> = [];
            var childNodes: Array<Match> = this.$scope.matches;

            while (childNodes.length > 0) {
                levels.push(childNodes);
                var treeNodes: Array<Match> = [];
                childNodes.reduce((parent: Match, child: Match): Match => {
                    if(!parent.leftChild) {
                        parent.leftChild = child;
                        return parent;
                    } else {
                        parent.rightChild = child;
                        treeNodes.push(parent);
                        return new Match();
                    }
                }, new Match());
                childNodes = treeNodes;
            }
            this.$scope.levels = levels;
        }

        public addTeam(name: string): void {
            this.$scope.teams.push(new Team(name));
            this.generateBaseMatches();
        }
    }
}
