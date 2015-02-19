/// <reference path='./ITournamentRepository.d.ts' />

module tourneyTracker {
    class LocalStorageTournamentRepository implements ITournamentRepository {
        public get(key: string): Tournament {
            return null;
        }
        public put(key: string, tournament: Tournament) {

        }
    }
}
