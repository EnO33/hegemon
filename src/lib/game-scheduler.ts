// src/lib/game-scheduler.ts (version complète)
export class GameScheduler {
  private static instance: GameScheduler;
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning = false;
  private tickCount = 0;

  private constructor() {}

  static getInstance(): GameScheduler {
    if (!GameScheduler.instance) {
      GameScheduler.instance = new GameScheduler();
    }
    return GameScheduler.instance;
  }

  start() {
    if (this.isRunning) {
      console.log('🎮 Planificateur déjà en cours');
      return;
    }

    console.log('🎮 Démarrage du planificateur de jeu');
    
    // Exécuter le tick toutes les minutes
    this.intervalId = setInterval(async () => {
      this.tickCount++;
      
      try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                       (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
        
        const response = await fetch(`${baseUrl}/api/game/tick`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const result = await response.json();
          if (result.processed.buildings > 0 || result.processed.cities > 0) {
            console.log(`🔄 Tick #${this.tickCount}:`, result.processed);
          }
        } else {
          console.error('❌ Erreur lors du tick de jeu:', response.statusText);
        }
      } catch (error) {
        console.error('❌ Erreur de connexion lors du tick:', error);
      }
    }, 60000); // 1 minute

    this.isRunning = true;
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    this.tickCount = 0;
    console.log('⏹️ Arrêt du planificateur de jeu');
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      intervalId: this.intervalId !== null,
      tickCount: this.tickCount,
    };
  }

  // Forcer un tick manuel
  async forceTick() {
    console.log('🔄 Tick manuel forcé');
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                     (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
      
      const response = await fetch(`${baseUrl}/api/game/tick`, {
        method: 'POST',
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Tick manuel réussi:', result.processed);
        return result;
      } else {
        console.error('❌ Erreur lors du tick manuel:', response.statusText);
        return null;
      }
    } catch (error) {
      console.error('❌ Erreur de connexion lors du tick manuel:', error);
      return null;
    }
  }
}

// Initialisation automatique en développement
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Attendre que la page soit chargée
  window.addEventListener('load', () => {
    setTimeout(() => {
      GameScheduler.getInstance().start();
    }, 2000); // Attendre 2 secondes après le chargement
  });
}