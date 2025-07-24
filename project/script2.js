// Wait for the DOM to be fully loaded before initializing the app
document.addEventListener("DOMContentLoaded", () => {
  // WellnessApp class manages the wellness tracking application
  class WellnessApp {
    // Constructor initializes app state and configuration
    constructor() {
      // Retrieve user name from localStorage or use default 'User'
      this.userName = localStorage.getItem("userName") || "User";
      // Default selected mood
      this.selectedMood = "very-happy";
      // Default selected calendar day
      this.selectedDay = 22;
      // Track completion state of activities
      this.activities = {
        "save-mood": false,
        "how-feel": false,
        "record-sleep": false,
        notifications: false,
      };
      // Meditation session state
      this.meditationState = {
        timeRemaining: 0,
        totalTime: 0,
        isActive: false,
        isPaused: false,
        sessionInterval: null,
        breathingInterval: null,
        breathingPhase: "inhale", // inhale, hold, exhale
        currentSound: null,
        audio: null, // Audio object for meditation sound
      };
      // Initialize the app
      this.init();
    }

    // Initialize the app by binding event listeners and setting up UI
    init() {
      // Bind event listeners for UI interactions
      this.bindEventListeners();
      // Bind event listeners for diary popup
      this.bindDiaryEvents();
      // Update greeting based on time of day
      this.updateGreeting();
      // Animate UI elements for visual feedback
      this.animateElements();
      // Register service worker for PWA capabilities
      this.registerServiceWorker();
    }

    // Bind event listeners for various UI elements
    bindEventListeners() {
      // Mood selector: Add click handlers to mood options
      document.querySelectorAll(".mood-option").forEach((option) => {
        option.addEventListener("click", (e) => this.selectMood(e.target));
      });

      // Calendar days: Add click handlers to calendar day items
      document.querySelectorAll(".day-item").forEach((day) => {
        day.addEventListener("click", (e) => this.selectDay(e.currentTarget));
      });

      // Support cards: Add click handlers for support actions
      document.querySelectorAll(".support-card").forEach((card) => {
        card.addEventListener("click", (e) =>
          this.handleSupportAction(e.currentTarget)
        );
      });

      // Journal cards: Add click handlers for journal actions
      document.querySelectorAll(".journal-card").forEach((card) => {
        card.addEventListener("click", (e) =>
          this.handleJournalAction(e.currentTarget)
        );
      });

      // Activity items: Add click handlers for activity toggles
      document.querySelectorAll(".activity-item").forEach((item) => {
        item.addEventListener("click", (e) =>
          this.handleActivityAction(e.currentTarget)
        );
      });

      // Bottom navigation: Add click handlers for navigation items
      document.querySelectorAll(".nav-item").forEach((nav) => {
        nav.addEventListener("click", (e) =>
          this.handleNavigation(e.currentTarget)
        );
      });

      // Add haptic feedback for touch devices
      this.addTouchFeedback();
    }

    // Bind event listeners for diary popup interactions
    bindDiaryEvents() {
      // Select diary-related DOM elements
      const diaryBtn = document.querySelector(
        '.journal-card[data-action="diary-record"]'
      );
      const diaryPopupOverlay = document.getElementById("diaryPopupOverlay");
      const diaryClose = diaryPopupOverlay?.querySelector(".diary-popup-close");
      const diarySaveBtn = diaryPopupOverlay?.querySelector("#diaryPopupSave");
      const diaryTextarea = document.getElementById("diaryTextarea");

      // Check if required elements exist
      if (
        !diaryBtn ||
        !diaryPopupOverlay ||
        !diaryClose ||
        !diarySaveBtn ||
        !diaryTextarea
      ) {
        console.error("Diary elements not found");
        this.showToast("Error: Diary functionality unavailable");
        return;
      }

      // Open diary popup and focus textarea
      diaryBtn.addEventListener("click", () => {
        diaryPopupOverlay.classList.add("active");
        diaryPopupOverlay.setAttribute("aria-hidden", "false");
        diaryTextarea.value = ""; // Clear previous content
        diaryTextarea.focus();
      });

      // Close diary popup with close button
      diaryClose.addEventListener("click", () => {
        diaryPopupOverlay.classList.remove("active");
        diaryPopupOverlay.setAttribute("aria-hidden", "true");
      });

      // Close diary popup when clicking outside
      diaryPopupOverlay.addEventListener("click", (e) => {
        if (e.target === diaryPopupOverlay) {
          diaryPopupOverlay.classList.remove("active");
          diaryPopupOverlay.setAttribute("aria-hidden", "true");
        }
      });

      // Save diary entry to localStorage
      diarySaveBtn.addEventListener("click", () => {
        const entry = diaryTextarea.value.trim();
        if (entry.length) {
          try {
            // Load existing entries or initialize empty array
            let diaryEntries = JSON.parse(
              localStorage.getItem("diaryEntries") || "[]"
            );
            diaryEntries.push({
              date: new Date().toISOString(),
              text: entry,
            });
            // Save updated entries
            localStorage.setItem("diaryEntries", JSON.stringify(diaryEntries));
            this.showToast("Diary entry saved!");
            diaryPopupOverlay.classList.remove("active");
            diaryPopupOverlay.setAttribute("aria-hidden", "true");
          } catch (e) {
            this.showToast("Failed to save diary entry: " + e.message);
          }
        } else {
          this.showToast("Please enter some text before saving.");
          diaryTextarea.focus();
        }
      });
    }

    // Handle mood selection
    selectMood(moodElement) {
      // Remove 'selected' class from all mood options
      document.querySelectorAll(".mood-option").forEach((opt) => {
        opt.classList.remove("selected");
      });
      // Add 'selected' class to clicked mood
      moodElement.classList.add("selected");
      // Update selected mood
      this.selectedMood = moodElement.dataset.mood;
      // Add visual ripple effect
      this.createRippleEffect(moodElement);
      // Show confirmation toast
      this.showToast(`Mood "${this.selectedMood}" recorded!`);
    }

    // Handle calendar day selection
    selectDay(dayElement) {
      // Remove 'active' class from all day items
      document.querySelectorAll(".day-item").forEach((day) => {
        day.classList.remove("active");
      });
      // Add 'active' class to clicked day
      dayElement.classList.add("active");
      // Update selected day
      this.selectedDay = parseInt(
        dayElement.querySelector(".day-number").textContent
      );
      // Add visual ripple effect
      this.createRippleEffect(dayElement);
    }

    // Handle support card actions
    handleSupportAction(card) {
      const action = card.dataset.action;
      // Add visual ripple effect
      this.createRippleEffect(card);
      switch (action) {
        case "coping-cards":
          // Show modal for coping strategies
          this.showModal(
            "Coping Cards",
            "Access your personalized coping strategies and techniques."
          );
          break;
        case "emergency-help":
          // Show modal for emergency resources
          this.showModal(
            "Emergency Help",
            "Immediate support resources and crisis helplines are available 24/7."
          );
          break;
      }
    }

    // Handle journal card actions
    handleJournalAction(card) {
      const action = card.dataset.action;
      // Add visual ripple effect
      this.createRippleEffect(card);
      switch (action) {
        case "mood-record":
          // Show mood recording popup
          this.showMoodRecordPopup();
          break;
        case "diary-record":
          // Show diary modal (handled by bindDiaryEvents)
          break;
        case "meditation":
          // Show meditation popup
          this.showMeditationPopup();
          break;
      }
    }

    // Show mood recording popup
    showMoodRecordPopup() {
      // Create popup overlay with accessibility attributes
      const popup = document.createElement("div");
      popup.className = "mood-popup-overlay";
      popup.setAttribute("role", "dialog");
      popup.setAttribute("aria-labelledby", "mood-popup-title");
      popup.innerHTML = `
            <div class="mood-popup">
                <div class="mood-popup-header">
                    <button class="mood-popup-close" aria-label="Close mood popup">×</button>
                </div>
                <div class="mood-popup-content">
                    <div class="mood-tabs">
                        <button class="mood-tab active" data-tab="mood">Mood</button>
                        <button class="mood-tab" data-tab="emotions">Emotions</button>
                    </div>
                    <div class="mood-view active" id="mood-view">
                        <h2>How's your mood?</h2>
                        <div class="mood-emoji-selector">
                            <div class="mood-emoji" data-mood="very-sad">😢</div>
                            <div class="mood-emoji" data-mood="sad">😔</div>
                            <div class="mood-emoji" data-mood="neutral">😐</div>
                            <div class="mood-emoji" data-mood="happy">😊</div>
                            <div class="mood-emoji" data-mood="very-happy">😄</div>
                        </div>
                        <div class="mood-textarea">
                            <textarea placeholder="Optional: What caused the change in your mood?" rows="4"></textarea>
                        </div>
                        <div class="color-association">
                            <h3>Associate a colour with your mood</h3>
                            <div class="color-selector">
                                <div class="color-option" data-color="white" style="background: #f8f9fa; border: 2px solid #dee2e6;"></div>
                                <div class="color-option" data-color="blue" style="background: #007bff;"></div>
                                <div class="color-option" data-color="dark-blue" style="background: #0056b3;"></div>
                                <div class="color-option" data-color="green" style="background: #28a745;"></div>
                                <div class="color-option" data-color="yellow" style="background: #ffc107;"></div>
                                <div class="color-option" data-color="orange" style="background: #fd7e14;"></div>
                            </div>
                        </div>
                        <button class="mood-save-btn">Save</button>
                    </div>
                    <div class="mood-view" id="emotions-view">
                        <h2>How do you feel?</h2>
                        <div class="emotions-section">
                            <h3>Emotions</h3>
                            <div class="emotions-grid">
                                <div class="emotion-item" data-emotion="delighted"><div class="emotion-emoji">😊</div><span>Delighted</span></div>
                                <div class="emotion-item" data-emotion="happy"><div class="emotion-emoji">😄</div><span>Happy</span></div>
                                <div class="emotion-item" data-emotion="inspired"><div class="emotion-emoji">🤩</div><span>Inspired</span></div>
                                <div class="emotion-item" data-emotion="empathic"><div class="emotion-emoji">🥺</div><span>Empathic</span></div>
                                <div class="emotion-item" data-emotion="cheerful"><div class="emotion-emoji">😆</div><span>Cheerful</span></div>
                                <div class="emotion-item" data-emotion="content"><div class="emotion-emoji">😌</div><span>Content</span></div>
                                <div class="emotion-item" data-emotion="amused"><div class="emotion-emoji">😄</div><span>Amused</span></div>
                                <div class="emotion-item" data-emotion="peaceful"><div class="emotion-emoji">😇</div><span>Peaceful</span></div>
                                <div class="emotion-item" data-emotion="interested"><div class="emotion-emoji">🤔</div><span>Interested</span></div>
                                <div class="emotion-item" data-emotion="hopeful"><div class="emotion-emoji">🙂</div><span>Hopeful</span></div>
                                <div class="emotion-item" data-emotion="trusting"><div class="emotion-emoji">😊</div><span>Trusting</span></div>
                                <div class="emotion-item" data-emotion="enthusiast"><div class="emotion-emoji">🤗</div><span>Enthusiast</span></div>
                                <div class="emotion-item" data-emotion="curious"><div class="emotion-emoji">🤨</div><span>Curious</span></div>
                                <div class="emotion-item" data-emotion="serene"><div class="emotion-emoji">😌</div><span>Serene</span></div>
                                <div class="emotion-item" data-emotion="blessed"><div class="emotion-emoji">🙏</div><span>Blessed</span></div>
                                <div class="emotion-item" data-emotion="neutral"><div class="emotion-emoji">😐</div><span>Neutral</span></div>
                                <div class="emotion-item" data-emotion="indifferent"><div class="emotion-emoji">😑</div><span>Indifferent</span></div>
                                <div class="emotion-item" data-emotion="fine"><div class="emotion-emoji">🙂</div><span>Fine</span></div>
                                <div class="emotion-item" data-emotion="relaxed"><div class="emotion-emoji">😎</div><span>Relaxed</span></div>
                                <div class="emotion-item" data-emotion="calm"><div class="emotion-emoji">😌</div><span>Calm</span></div>
                                <div class="emotion-item" data-emotion="angry"><div class="emotion-emoji">😠</div><span>Angry</span></div>
                                <div class="emotion-item" data-emotion="resentful"><div class="emotion-emoji">😤</div><span>Resentful</span></div>
                                <div class="emotion-item" data-emotion="hateful"><div class="emotion-emoji">😡</div><span>Hateful</span></div>
                                <div class="emotion-item" data-emotion="regretful"><div class="emotion-emoji">😞</div><span>Regretful</span></div>
                                <div class="emotion-item" data-emotion="hostile"><div class="emotion-emoji">😾</div><span>Hostile</span></div>
                                <div class="emotion-item" data-emotion="grieving"><div class="emotion-emoji">😢</div><span>Grieving</span></div>
                                <div class="emotion-item" data-emotion="heartbroken"><div class="emotion-emoji">💔</div><span>Heartbroken</span></div>
                                <div class="emotion-item" data-emotion="sorrowful"><div class="emotion-emoji">😭</div><span>Sorrowful</span></div>
                                <div class="emotion-item" data-emotion="depressed"><div class="emotion-emoji">😔</div><span>Depressed</span></div>
                                <div class="emotion-item" data-emotion="shaming"><div class="emotion-emoji">😳</div><span>Shaming</span></div>
                                <div class="emotion-item" data-emotion="furious"><div class="emotion-emoji">🤬</div><span>Furious</span></div>
                                <div class="emotion-item" data-emotion="miserable"><div class="emotion-emoji">😩</div><span>Miserable</span></div>
                                <div class="emotion-item" data-emotion="hopeless"><div class="emotion-emoji">😰</div><span>Hopeless</span></div>
                                <div class="emotion-item" data-emotion="threatening"><div class="emotion-emoji">😈</div><span>Threatening</span></div>
                                <div class="emotion-item" data-emotion="unhappy"><div class="emotion-emoji">☹️</div><span>Unhappy</span></div>
                            </div>
                        </div>
                        <div class="triggers-section">
                            <h3>Triggers</h3>
                            <div class="triggers-grid">
                                <div class="trigger-item" data-trigger="relationship"><div class="trigger-icon">💙</div><span>Relationship</span></div>
                                <div class="trigger-item" data-trigger="work"><div class="trigger-icon">💼</div><span>Work</span></div>
                                <div class="trigger-item" data-trigger="family"><div class="trigger-icon">👨‍👩‍👧‍👦</div><span>Family</span></div>
                                <div class="trigger-item" data-trigger="finance"><div class="trigger-icon">💰</div><span>Finance</span></div>
                                <div class="trigger-item" data-trigger="health"><div class="trigger-icon">🏥</div><span>Health</span></div>
                                <div class="trigger-item" data-trigger="food"><div class="trigger-icon">🍽️</div><span>Food</span></div>
                                <div class="trigger-item" data-trigger="pet"><div class="trigger-icon">🐾</div><span>Pet</span></div>
                                <div class="trigger-item" data-trigger="nature"><div class="trigger-icon">🌿</div><span>Nature</span></div>
                                <div class="trigger-item" data-trigger="art"><div class="trigger-icon">🎨</div><span>Art</span></div>
                                <div class="trigger-item" data-trigger="exercise"><div class="trigger-icon">🏃‍♂️</div><span>Exercise</span></div>
                                <div class="trigger-item" data-trigger="meditation"><div class="trigger-icon">🧘‍♀️</div><span>Meditation</span></div>
                                <div class="trigger-item" data-trigger="learning"><div class="trigger-icon">📚</div><span>Learning</span></div>
                                <div class="trigger-item" data-trigger="community"><div class="trigger-icon">🤝</div><span>Community</span></div>
                                <div class="trigger-item" data-trigger="hobby"><div class="trigger-icon">🎯</div><span>Hobby</span></div>
                                <div class="trigger-item" data-trigger="friendship"><div class="trigger-icon">👫</div><span>Friendship</span></div>
                            </div>
                        </div>
                        <button class="mood-save-btn">Save</button>
                    </div>
                </div>
            </div>
        `;

      // Append popup to document body
      document.body.appendChild(popup);
      // Bind event listeners for popup interactions
      this.bindMoodPopupEvents(popup);
      // Animate popup entrance
      setTimeout(() => {
        popup.classList.add("active");
        popup.querySelector(".mood-popup").focus();
      }, 10);
    }

    // Bind event listeners for mood popup interactions
    bindMoodPopupEvents(popup) {
      // Close popup on close button click
      popup.querySelector(".mood-popup-close").addEventListener("click", () => {
        this.closeMoodPopup(popup);
      });

      // Close popup when clicking outside
      popup.addEventListener("click", (e) => {
        if (e.target === popup) {
          this.closeMoodPopup(popup);
        }
      });

      // Handle tab switching
      popup.querySelectorAll(".mood-tab").forEach((tab) => {
        tab.addEventListener("click", (e) => {
          this.switchMoodTab(e.target.dataset.tab, popup);
        });
      });

      // Handle mood emoji selection
      popup.querySelectorAll(".mood-emoji").forEach((emoji) => {
        emoji.addEventListener("click", (e) => {
          popup
            .querySelectorAll(".mood-emoji")
            .forEach((em) => em.classList.remove("selected"));
          e.target.classList.add("selected");
        });
      });

      // Handle color selection
      popup.querySelectorAll(".color-option").forEach((color) => {
        color.addEventListener("click", (e) => {
          popup
            .querySelectorAll(".color-option")
            .forEach((c) => c.classList.remove("selected"));
          e.target.classList.add("selected");
        });
      });

      // Handle emotion selection
      popup.querySelectorAll(".emotion-item").forEach((emotion) => {
        emotion.addEventListener("click", (e) => {
          e.currentTarget.classList.toggle("selected");
        });
      });

      // Handle trigger selection
      popup.querySelectorAll(".trigger-item").forEach((trigger) => {
        trigger.addEventListener("click", (e) => {
          e.currentTarget.classList.toggle("selected");
        });
      });

      // Handle save button click
      popup.querySelectorAll(".mood-save-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          this.saveMoodRecord(popup);
        });
      });
    }

    // Switch between mood and emotions tabs in popup
    switchMoodTab(tabName, popup) {
      // Update tab button states
      popup.querySelectorAll(".mood-tab").forEach((tab) => {
        tab.classList.remove("active");
      });
      popup.querySelector(`[data-tab="${tabName}"]`).classList.add("active");

      // Update view visibility
      popup.querySelectorAll(".mood-view").forEach((view) => {
        view.classList.remove("active");
      });
      popup.querySelector(`#${tabName}-view`).classList.add("active");
    }

    // Close mood popup with animation
    closeMoodPopup(popup) {
      popup.classList.remove("active");
      setTimeout(() => {
        popup.remove();
      }, 300);
    }

    // Show meditation settings popup
    showMeditationPopup() {
      // Create meditation popup with accessibility attributes
      const popup = document.createElement("div");
      popup.className = "meditation-popup-overlay";
      popup.setAttribute("role", "dialog");
      popup.setAttribute("aria-labelledby", "meditation-popup-title");
      popup.innerHTML = `
            <div class="meditation-popup">
                <div class="meditation-popup-header">
                    <button class="meditation-popup-close" aria-label="Close meditation popup">×</button>
                </div>
                <div class="meditation-popup-content">
                    <h1>Meditate</h1>
                    <p class="meditation-description">
                        It helps beat stress, anxiety, and boosts emotional well-being. Give it a try – 
                        your mind will thank you!
                    </p>
                    <div class="meditation-duration-section">
                        <h3>Select meditation time duration</h3>
                        <div class="duration-options">
                            <button class="duration-btn" data-duration="3">3 min</button>
                            <button class="duration-btn" data-duration="5">5 min</button>
                            <button class="duration-btn" data-duration="10">10 min</button>
                            <button class="duration-btn" data-duration="15">15 min</button>
                            <button class="duration-btn" data-duration="20">20 min</button>
                        </div>
                    </div>
                    <div class="meditation-sound-section">
                        <h3>Choose a meditation sound</h3>
                        <div class="sound-options">
                            <div class="sound-option" data-sound="none">
                                <div class="sound-radio">
                                    <input type="radio" name="meditation-sound" id="no-sound" value="none">
                                    <label for="no-sound"></label>
                                </div>
                                <span class="sound-label">No Sound</span>
                            </div>
                            <div class="sound-option" data-sound="river">
                                <div class="sound-card">
                                    <img src="https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=400" alt="River">
                                    <div class="sound-overlay">
                                        <div class="sound-radio">
                                            <input type="radio" name="meditation-sound" id="river-sound" value="river">
                                            <label for="river-sound"></label>
                                        </div>
                                        <span class="sound-title">River</span>
                                    </div>
                                </div>
                            </div>
                            <div class="sound-option" data-sound="forest">
                                <div class="sound-card">
                                    <img src="https://images.pexels.com/photos/1496373/pexels-photo-1496373.jpeg?auto=compress&cs=tinysrgb&w=400" alt="Forest walk">
                                    <div class="sound-overlay">
                                        <div class="sound-radio">
                                            <input type="radio" name="meditation-sound" id="forest-sound" value="forest">
                                            <label for="forest-sound"></label>
                                        </div>
                                        <span class="sound-title">Forest walk</span>
                                    </div>
                                </div>
                            </div>
                            <div class="sound-option" data-sound="morning">
                                <div class="sound-card">
                                    <img src="https://images.pexels.com/photos/1431822/pexels-photo-1431822.jpeg?auto=compress&cs=tinysrgb&w=400" alt="Morning sun">
                                    <div class="sound-overlay">
                                        <div class="sound-radio">
                                            <input type="radio" name="meditation-sound" id="morning-sound" value="morning">
                                            <label for="morning-sound"></label>
                                        </div>
                                        <span class="sound-title">Morning sun</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button class="meditation-start-btn">Start Meditation</button>
                </div>
            </div>
        `;

      // Append popup to document body
      document.body.appendChild(popup);
      // Bind event listeners for popup interactions
      this.bindMeditationPopupEvents(popup);
      // Animate popup entrance
      setTimeout(() => {
        popup.classList.add("active");
        popup.querySelector(".meditation-popup").focus();
      }, 10);
    }

    // Bind event listeners for meditation popup interactions
    bindMeditationPopupEvents(popup) {
      // Close popup on close button click
      popup
        .querySelector(".meditation-popup-close")
        .addEventListener("click", () => {
          this.closeMeditationPopup(popup);
        });

      // Close popup when clicking outside
      popup.addEventListener("click", (e) => {
        if (e.target === popup) {
          this.closeMeditationPopup(popup);
        }
      });

      // Handle duration selection
      popup.querySelectorAll(".duration-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          popup
            .querySelectorAll(".duration-btn")
            .forEach((b) => b.classList.remove("selected"));
          e.target.classList.add("selected");
        });
      });

      // Handle sound selection
      popup.querySelectorAll(".sound-option").forEach((option) => {
        option.addEventListener("click", (e) => {
          const radio = option.querySelector('input[type="radio"]');
          radio.checked = true;
          popup.querySelectorAll(".sound-option").forEach((opt) => {
            opt.classList.remove("selected");
          });
          option.classList.add("selected");
        });
      });

      // Start meditation with countdown
      popup
        .querySelector(".meditation-start-btn")
        .addEventListener("click", () => {
          const selectedDuration = popup.querySelector(
            ".duration-btn.selected"
          );
          const selectedSound = popup.querySelector(
            'input[name="meditation-sound"]:checked'
          );
          if (selectedDuration && selectedSound) {
            const duration = parseInt(selectedDuration.dataset.duration);
            const sound = selectedSound.value;
            this.startMeditation(duration, sound, popup);
          } else {
            this.showToast("Please select duration and sound");
          }
        });
    }

    // Close meditation popup with animation
    closeMeditationPopup(popup) {
      popup.classList.remove("active");
      setTimeout(() => {
        popup.remove();
      }, 300);
    }

    // Load audio for meditation
    loadMeditationAudio(sound) {
      // Define audio sources (replace with your actual audio file URLs or paths)
      const audioSources = {
        // river: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",

        river: "project/audios/river_sound.mp3",
        forest: "project/audios/forest_sound.mp3",
        morning: "project/audios/morning_sound.mp3",
      };

      // Stop and clear any existing audio
      if (this.meditationState.audio) {
        this.meditationState.audio.pause();
        this.meditationState.audio = null;
      }

      // Load new audio if sound is not "none"
      if (sound !== "none" && audioSources[sound]) {
        this.meditationState.audio = new Audio(audioSources[sound]);
        this.meditationState.audio.loop = true; // Loop the audio for continuous play
        this.meditationState.audio.volume = 0.5; // Set default volume (adjustable)
      }
    }

    // Start meditation with validated duration and sound
    startMeditation(duration, sound, settingsPopup) {
      // Validate duration
      if (!duration || isNaN(duration) || duration <= 0) {
        this.showToast("Invalid meditation duration");
        return;
      }
      // Validate sound
      if (!["none", "river", "forest", "morning"].includes(sound)) {
        this.showToast("Invalid meditation sound");
        return;
      }
      // Initialize meditation state
      this.meditationState.totalTime = duration * 60;
      this.meditationState.timeRemaining = this.meditationState.totalTime;
      this.meditationState.currentSound = sound;
      // Load audio
      this.loadMeditationAudio(sound);
      // Close settings popup
      this.closeMeditationPopup(settingsPopup);
      // Show countdown UI
      this.showMeditationCountdownUI();
    }

    // Show countdown UI before meditation session
    showMeditationCountdownUI() {
      // Create countdown popup with accessibility attributes
      const popup = document.createElement("div");
      popup.className = "meditation-countdown-overlay";
      popup.setAttribute("role", "dialog");
      popup.setAttribute("aria-labelledby", "countdown-title");
      popup.innerHTML = `
                <div class="countdown-container">
                    <h2 id="countdown-title" class="sr-only">Meditation Countdown</h2>
                    <div class="countdown-number" aria-live="polite">3</div>
                    <div class="countdown-text">Prepare to meditate...</div>
                </div>
            `;

      // Append popup to body
      document.body.appendChild(popup);

      // Add countdown styles
      if (!document.querySelector("#countdown-styles")) {
        const countdownStyles = document.createElement("style");
        countdownStyles.id = "countdown-styles";
        countdownStyles.textContent = `
                    .meditation-countdown-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 1002;
                        animation: fadeIn 0.3s ease;
                    }
                    .countdown-container {
                        text-align: center;
                        color: white;
                    }
                    .countdown-number {
                        font-size: 6rem;
                        font-weight: 700;
                        margin-bottom: 1rem;
                        animation: bounce 1s ease-in-out;
                    }
                    .countdown-text {
                        font-size: 1.5rem;
                        opacity: 0.9;
                    }
                    @keyframes bounce {
                        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                        40% { transform: translateY(-20px); }
                        60% { transform: translateY(-10px); }
                    }
                    @media (max-width: 480px) {
                        .countdown-number { font-size: 4rem; }
                        .countdown-text { font-size: 1.2rem; }
                    }
                `;
        document.head.appendChild(countdownStyles);
      }

      // Start countdown
      let count = 3;
      const countdownNumber = popup.querySelector(".countdown-number");
      const countdownInterval = setInterval(() => {
        countdownNumber.textContent = count;
        countdownNumber.style.animation = "none";
        setTimeout(() => {
          countdownNumber.style.animation = "bounce 1s ease-in-out";
        }, 10);
        count--;
        if (count < 0) {
          clearInterval(countdownInterval);
          popup.remove();
          this.showMeditationSessionUI();
        }
      }, 1000);

      // Animate popup entrance
      setTimeout(() => {
        popup.classList.add("active");
        countdownNumber.focus();
      }, 10);
    }

    // Show meditation session UI
    showMeditationSessionUI() {
      // Create session popup with accessibility attributes
      const popup = document.createElement("div");
      popup.className = `meditation-session-overlay ${this.meditationState.currentSound}-theme`;
      popup.setAttribute("role", "dialog");
      popup.setAttribute("aria-labelledby", "session-title");
      popup.innerHTML = `
                <div class="session-header">
                    <button class="session-close-btn" aria-label="Close meditation session">×</button>
                    <div class="session-info">
                        <div class="session-title">Meditation</div>
                        <div class="session-sound">${
                          this.meditationState.currentSound === "none"
                            ? "Silent"
                            : this.meditationState.currentSound
                                .charAt(0)
                                .toUpperCase() +
                              this.meditationState.currentSound.slice(1)
                        }</div>
                    </div>
                    <div class="spacer"></div>
                </div>
                <div class="progress-container">
                    <div class="progress-bar">
                        <div class="progress-fill"></div>
                    </div>
                </div>
                <div class="session-content">
                    <div class="timer-display" aria-live="polite">00:00</div>
                    <div class="breathing-container">
                        <div class="breathing-circle">
                            <div class="breathing-inner">
                                <div class="breathing-text">
                                    <div class="breathing-instruction">Breathe In</div>
                                    <div class="breathing-guide">Follow the circle</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="session-controls">
                        <button class="control-btn play-pause-btn" aria-label="Pause meditation">
                            <span class="play-icon">▶</span>
                            <span class="pause-icon">⏸</span>
                        </button>
                        <button class="control-btn reset-btn" aria-label="Stop meditation">↻</button>
                    </div>
                    <div class="session-status">Active Session</div>
                </div>
            `;

      // Append popup to body
      document.body.appendChild(popup);

      // Add session styles
      if (!document.querySelector("#session-styles")) {
        const sessionStyles = document.createElement("style");
        sessionStyles.id = "session-styles";
        sessionStyles.textContent = `
                    .meditation-session-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        display: flex;
                        flex-direction: column;
                        z-index: 1002;
                        color: white;
                        animation: fadeIn 0.3s ease;
                    }
                    .meditation-session-overlay.river-theme {
                       background: linear-gradient(135deg, #1a365d 0%, #2c5282 100%);
                    }
                    .meditation-session-overlay.forest-theme {
                        background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
                    }
                    .meditation-session-overlay.morning-theme {
                        background: linear-gradient(135deg, #744210 0%, #b7791f 100%);
                    }
                    .session-header {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        padding: 1.5rem;
                        position: relative;
                    }
                    .session-close-btn {
                        background: none;
                        border: none;
                        color: white;
                        font-size: 1.5rem;
                        cursor: pointer;
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: all 0.2s ease;
                    }
                    .session-close-btn:hover {
                        background: rgba(255, 255, 255, 0.1);
                    }
                    .session-info {
                        text-align: center;
                        flex: 1;
                    }
                    .session-title {
                        font-size: 0.9rem;
                        opacity: 0.8;
                    }
                    .session-sound {
                        font-weight: 600;
                        text-transform: capitalize;
                    }
                    .spacer {
                        width: 40px;
                    }
                    .progress-container {
                        padding: 0;
                    }
                    .progress-bar {
                        width: 100%;
                        height: 4px;
                        background: rgba(255, 255, 255, 0.2);
                        border-radius: 2px;
                        overflow: hidden;
                    }
                    .progress-fill {
                        height: 100%;
                        background: linear-gradient(90deg, #8b5cf6, #ec4899);
                        width: 0%;
                        transition: width 1s ease;
                    }
                    .session-content {
                        flex: 1;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        padding: 1rem;
                        text-align: center;
                    }
                    .timer-display {
                        font-size: 4rem;
                        font-weight: 700;
                        margin-bottom: 2rem;
                        font-variant-numeric: tabular-nums;
                    }
                    .breathing-container {
                        margin-bottom: 3rem;
                        position: relative;
                    }
                    .breathing-circle {
                        width: 250px;
                        height: 250px;
                        border-radius: 50%;
                        background: linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.3));
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        position: relative;
                        transition: transform 4s ease-in-out;
                    }
                    .breathing-circle::before {
                        content: '';
                        position: absolute;
                        inset: 20px;
                        border-radius: 50%;
                        background: linear-gradient(135deg, rgba(139, 92, 246, 0.4), rgba(236, 72, 153, 0.4));
                        transition: transform 4s ease-in-out;
                    }
                    .breathing-circle::after {
                        content: '';
                        position: absolute;
                        inset: 40px;
                        border-radius: 50%;
                        background: linear-gradient(135deg, rgba(139, 92, 246, 0.5), rgba(236, 72, 153, 0.5));
                        transition: transform 4s ease-in-out;
                    }
                    .breathing-circle.inhale {
                        transform: scale(1.3);
                    }
                    .breathing-circle.inhale::before {
                        transform: scale(1.1);
                    }
                    .breathing-circle.inhale::after {
                        transform: scale(1.2);
                    }
                    .breathing-inner {
                        position: relative;
                        z-index: 10;
                    }
                    .breathing-instruction {
                        font-size: 1.5rem;
                        font-weight: 600;
                        margin-bottom: 0.5rem;
                    }
                    .breathing-guide {
                        font-size: 0.9rem;
                        opacity: 0.8;
                    }
                    .session-controls {
                        display: flex;
                        gap: 1rem;
                        margin-bottom: 2rem;
                    }
                    .control-btn {
                        background: rgba(255, 255, 255, 0.2);
                        border: none;
                        border-radius: 50%;
                        color: white;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        backdrop-filter: blur(10px);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 1.2rem;
                    }
                    .play-pause-btn {
                        width: 60px;
                        height: 60px;
                        font-size: 1.5rem;
                    }
                    .reset-btn {
                        width: 60px;
                        height: 60px;
                    }
                    .control-btn:hover {
                        background: rgba(255, 255, 255, 0.3);
                    }
                    .play-pause-btn .pause-icon {
                        display: none;
                    }
                    .play-pause-btn.paused .play-icon {
                        display: none;
                    }
                    .play-pause-btn.paused .pause-icon {
                        display: inline;
                    }
                    .session-status {
                        opacity: 0.8;
                        font-size: 0.9rem;
                    }
                    @media (max-width: 480px) {
                        .timer-display { font-size: 2.5rem; }
                        .breathing-circle { width: 180px; height: 180px; }
                        .breathing-instruction { font-size: 1.2rem; }
                        .session-header { padding: 1rem; }
                    }
                `;
        document.head.appendChild(sessionStyles);
      }

      // Animate popup entrance
      setTimeout(() => {
        popup.classList.add("active");
        popup.querySelector(".session-content").focus();
      }, 10);

      // Initialize session
      this.meditationState.isActive = true;
      this.meditationState.isPaused = false;
      this.updateTimerDisplay(popup);
      this.updateProgressBar(popup);
      this.startSessionTimer(popup);
      this.startBreathingAnimation(popup);

      // Start audio playback if available
      if (this.meditationState.audio) {
        this.meditationState.audio.play().catch((e) => {
          this.showToast("Failed to play audio: " + e.message);
        });
      }

      // Bind event listeners
      const closeBtn = popup.querySelector(".session-close-btn");
      const playPauseBtn = popup.querySelector(".play-pause-btn");
      const resetBtn = popup.querySelector(".reset-btn");

      closeBtn.addEventListener("click", () => this.exitSession(popup, false));
      playPauseBtn.addEventListener("click", () => this.togglePause(popup));
      resetBtn.addEventListener("click", () => this.resetSession(popup));

      // Keyboard shortcuts
      popup.addEventListener("keydown", (e) => {
        if (!this.meditationState.isActive) return;
        switch (e.code) {
          case "Space":
            e.preventDefault();
            this.togglePause(popup);
            break;
          case "Escape":
            this.exitSession(popup, false);
            break;
          case "KeyR":
            this.resetSession(popup);
            break;
        }
      });
    }

    // Update timer display in session UI
    updateTimerDisplay(popup) {
      const minutes = Math.floor(this.meditationState.timeRemaining / 60);
      const seconds = this.meditationState.timeRemaining % 60;
      const timerDisplay = popup.querySelector(".timer-display");
      timerDisplay.textContent = `${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }

    // Update progress bar in session UI
    updateProgressBar(popup) {
      const progress =
        ((this.meditationState.totalTime - this.meditationState.timeRemaining) /
          this.meditationState.totalTime) *
        100;
      const progressFill = popup.querySelector(".progress-fill");
      progressFill.style.width = `${progress}%`;
    }

    // Update breathing animation in session UI
    updateBreathingCircle(popup) {
      const instructions = {
        inhale: "Breathe In",
        hold: "Hold",
        exhale: "Breathe Out",
      };
      const breathingInstruction = popup.querySelector(
        ".breathing-instruction"
      );
      const breathingCircle = popup.querySelector(".breathing-circle");
      breathingInstruction.textContent =
        instructions[this.meditationState.breathingPhase];
      breathingCircle.classList.remove("inhale");
      if (
        this.meditationState.breathingPhase === "inhale" ||
        this.meditationState.breathingPhase === "hold"
      ) {
        setTimeout(() => {
          breathingCircle.classList.add("inhale");
        }, 100);
      }
    }

    // Start session timer
    startSessionTimer(popup) {
      this.meditationState.sessionInterval = setInterval(() => {
        if (
          !this.meditationState.isPaused &&
          this.meditationState.timeRemaining > 0
        ) {
          this.meditationState.timeRemaining--;
          this.updateTimerDisplay(popup);
          this.updateProgressBar(popup);
          if (this.meditationState.timeRemaining === 0) {
            this.completeSession(popup);
          }
        }
      }, 1000);
    }

    // Start breathing animation
    startBreathingAnimation(popup) {
      this.meditationState.breathingPhase = "inhale";
      this.updateBreathingCircle(popup);
      this.meditationState.breathingInterval = setInterval(() => {
        if (!this.meditationState.isPaused) {
          switch (this.meditationState.breathingPhase) {
            case "inhale":
              this.meditationState.breathingPhase = "hold";
              break;
            case "hold":
              this.meditationState.breathingPhase = "exhale";
              break;
            case "exhale":
              this.meditationState.breathingPhase = "inhale";
              break;
          }
          this.updateBreathingCircle(popup);
        }
      }, 4000);
    }

    // Toggle pause/resume for meditation session
    togglePause(popup) {
      this.meditationState.isPaused = !this.meditationState.isPaused;
      const playPauseBtn = popup.querySelector(".play-pause-btn");
      const sessionStatus = popup.querySelector(".session-status");
      playPauseBtn.classList.toggle("paused", this.meditationState.isPaused);
      sessionStatus.textContent = this.meditationState.isPaused
        ? "Paused"
        : "Active Session";
      playPauseBtn.setAttribute(
        "aria-label",
        this.meditationState.isPaused ? "Resume meditation" : "Pause meditation"
      );

      // Pause or resume audio
      if (this.meditationState.audio) {
        if (this.meditationState.isPaused) {
          this.meditationState.audio.pause();
        } else {
          this.meditationState.audio.play().catch((e) => {
            this.showToast("Failed to resume audio: " + e.message);
          });
        }
      }
    }

    // Reset meditation session
    resetSession(popup) {
      // Stop audio
      if (this.meditationState.audio) {
        this.meditationState.audio.pause();
        this.meditationState.audio = null;
      }

      // Clear intervals
      if (this.meditationState.sessionInterval) {
        clearInterval(this.meditationState.sessionInterval);
        this.meditationState.sessionInterval = null;
      }
      if (this.meditationState.breathingInterval) {
        clearInterval(this.meditationState.breathingInterval);
        this.meditationState.breathingInterval = null;
      }
      // Reset state
      this.meditationState.isActive = false;
      this.meditationState.isPaused = false;
      this.meditationState.timeRemaining = this.meditationState.totalTime;
      this.meditationState.breathingPhase = "inhale";
      // Reset UI
      const playPauseBtn = popup.querySelector(".play-pause-btn");
      const breathingCircle = popup.querySelector(".breathing-circle");
      const progressFill = popup.querySelector(".progress-fill");
      playPauseBtn.classList.remove("paused");
      breathingCircle.classList.remove("inhale");
      progressFill.style.width = "0%";
      // Close current session UI
      popup.remove();
      // Reload audio and restart countdown
      this.loadMeditationAudio(this.meditationState.currentSound);
      this.showMeditationCountdownUI();
    }

    // Complete meditation session
    completeSession(popup) {
      // Stop audio
      if (this.meditationState.audio) {
        this.meditationState.audio.pause();
        this.meditationState.audio = null;
      }

      // Clear intervals
      if (this.meditationState.sessionInterval) {
        clearInterval(this.meditationState.sessionInterval);
        this.meditationState.sessionInterval = null;
      }
      if (this.meditationState.breathingInterval) {
        clearInterval(this.meditationState.breathingInterval);
        this.meditationState.breathingInterval = null;
      }
      // Save session data
      try {
        let meditationSessions = JSON.parse(
          localStorage.getItem("meditationSessions") || "[]"
        );
        meditationSessions.push({
          date: new Date().toISOString(),
          duration: this.meditationState.totalTime / 60,
          sound: this.meditationState.currentSound,
          completed: true,
        });
        localStorage.setItem(
          "meditationSessions",
          JSON.stringify(meditationSessions)
        );
      } catch (e) {
        this.showToast("Failed to save meditation session: " + e.message);
      }
      // Reset state
      this.meditationState.isActive = false;
      this.meditationState.isPaused = false;
      // Close session UI
      popup.remove();
      // Show completion UI
      this.showMeditationCompletionUI();
    }

    // Exit meditation session
    exitSession(popup, completed = false) {
      // Stop audio
      if (this.meditationState.audio) {
        this.meditationState.audio.pause();
        this.meditationState.audio = null;
      }

      // Clear intervals
      if (this.meditationState.sessionInterval) {
        clearInterval(this.meditationState.sessionInterval);
        this.meditationState.sessionInterval = null;
      }
      if (this.meditationState.breathingInterval) {
        clearInterval(this.meditationState.breathingInterval);
        this.meditationState.breathingInterval = null;
      }
      // Save session data if not completed
      if (!completed) {
        try {
          let meditationSessions = JSON.parse(
            localStorage.getItem("meditationSessions") || "[]"
          );
          meditationSessions.push({
            date: new Date().toISOString(),
            duration: this.meditationState.totalTime / 60,
            sound: this.meditationState.currentSound,
            completed: false,
          });
          localStorage.setItem(
            "meditationSessions",
            JSON.stringify(meditationSessions)
          );
        } catch (e) {
          this.showToast("Failed to save meditation session: " + e.message);
        }
      }
      // Reset state
      this.meditationState.isActive = false;
      this.meditationState.isPaused = false;
      this.meditationState.timeRemaining = 0;
      this.meditationState.breathingPhase = "inhale";
      this.meditationState.currentSound = null;
      // Reset UI
      const playPauseBtn = popup.querySelector(".play-pause-btn");
      const breathingCircle = popup.querySelector(".breathing-circle");
      const progressFill = popup.querySelector(".progress-fill");
      playPauseBtn.classList.remove("paused");
      breathingCircle.classList.remove("inhale");
      progressFill.style.width = "0%";
      popup.classList.remove("river-theme", "forest-theme", "morning-theme");
      // Close session UI
      popup.remove();
      // Show completion UI if completed
      if (completed) {
        this.showMeditationCompletionUI();
      }
    }

    // Show meditation completion UI
    showMeditationCompletionUI() {
      // Create completion popup with accessibility attributes
      const popup = document.createElement("div");
      popup.className = "meditation-completion-overlay";
      popup.setAttribute("role", "dialog");
      popup.setAttribute("aria-labelledby", "completion-title");
      popup.innerHTML = `
                <div class="completion-container">
                    <h2 id="completion-title" class="completion-title">Session Complete</h2>
                    <div class="completion-emoji">🧘‍♀️</div>
                    <p class="completion-text">Great job! You've completed your meditation.</p>
                    <div class="completion-buttons">
                        <button class="completion-btn primary" aria-label="Meditate again">
                            <span>↻</span> Meditate Again
                        </button>
                        <button class="completion-btn secondary" aria-label="Exit meditation">Exit</button>
                    </div>
                </div>
            `;

      // Append popup to body
      document.body.appendChild(popup);

      // Add completion styles
      if (!document.querySelector("#completion-styles")) {
        const completionStyles = document.createElement("style");
        completionStyles.id = "completion-styles";
        completionStyles.textContent = `
                    .meditation-completion-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 1002;
                        color: white;
                        animation: fadeIn 0.3s ease;
                    }
                    .completion-container {
                        text-align: center;
                        padding: 2rem;
                    }
                    .completion-emoji {
                        font-size: 4rem;
                        margin-bottom: 1.5rem;
                    }
                    .completion-title {
                        font-size: 2.5rem;
                        font-weight: 700;
                        margin-bottom: 1rem;
                    }
                    .completion-text {
                        font-size: 1.1rem;
                        opacity: 0.9;
                        margin-bottom: 2rem;
                    }
                    .completion-buttons {
                        display: flex;
                        gap: 1rem;
                        justify-content: center;
                        flex-wrap: wrap;
                    }
                    .completion-btn {
                        padding: 0.75rem 1.5rem;
                        border-radius: 50px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        font-family: inherit;
                        font-size: 1rem;
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                    }
                    .completion-btn.primary {
                        background: white;
                        color: #059669;
                        border: none;
                    }
                    .completion-btn.primary:hover {
                        background: #f0f0f0;
                    }
                    .completion-btn.secondary {
                        background: transparent;
                        color: white;
                        border: 2px solid white;
                    }
                    .completion-btn.secondary:hover {
                        background: white;
                        color: #059669;
                    }
                    @media (max-width: 480px) {
                        .completion-title { font-size: 2rem; }
                        .completion-buttons { flex-direction: column; align-items: center; }
                        .completion-btn { width: 200px; justify-content: center; }
                    }
                `;
        document.head.appendChild(completionStyles);
      }

      // Animate popup entrance
      setTimeout(() => {
        popup.classList.add("active");
        popup.querySelector(".completion-container").focus();
      }, 10);

      // Bind event listeners
      const meditateAgainBtn = popup.querySelector(".completion-btn.primary");
      const exitBtn = popup.querySelector(".completion-btn.secondary");

      meditateAgainBtn.addEventListener("click", () => {
        popup.remove();
        this.showMeditationPopup();
      });
      exitBtn.addEventListener("click", () => {
        popup.remove();
      });

      // Keyboard shortcuts
      popup.addEventListener("keydown", (e) => {
        if (e.code === "Enter") {
          popup.remove();
          this.showMeditationPopup();
        } else if (e.code === "Escape") {
          popup.remove();
        }
      });
    }

    // Save mood or emotion record to localStorage
    saveMoodRecord(popup) {
      const activeTab = popup.querySelector(".mood-tab.active").dataset.tab;

      if (activeTab === "mood") {
        // Handle mood tab save
        const selectedMood = popup.querySelector(".mood-emoji.selected");
        const selectedColor = popup.querySelector(".color-option.selected");
        const moodText = popup.querySelector("textarea").value;

        if (selectedMood) {
          try {
            // Save mood entry to localStorage
            let moodEntries = JSON.parse(
              localStorage.getItem("moodEntries") || "[]"
            );
            moodEntries.push({
              date: new Date().toISOString(),
              mood: selectedMood.dataset.mood,
              color: selectedColor?.dataset.color || "none",
              notes: moodText,
            });
            localStorage.setItem("moodEntries", JSON.stringify(moodEntries));
            this.showToast("Mood record saved successfully!");
            this.closeMoodPopup(popup);
          } catch (e) {
            this.showToast("Failed to save mood record: " + e.message);
          }
        } else {
          this.showToast("Please select a mood first");
        }
      } else {
        // Handle emotions tab save
        const selectedEmotions = popup.querySelectorAll(
          ".emotion-item.selected"
        );
        const selectedTriggers = popup.querySelectorAll(
          ".trigger-item.selected"
        );

        if (selectedEmotions.length > 0) {
          try {
            // Save emotion entry to localStorage
            let emotionEntries = JSON.parse(
              localStorage.getItem("emotionEntries") || "[]"
            );
            emotionEntries.push({
              date: new Date().toISOString(),
              emotions: Array.from(selectedEmotions).map(
                (e) => e.dataset.emotion
              ),
              triggers: Array.from(selectedTriggers).map(
                (t) => t.dataset.trigger
              ),
            });
            localStorage.setItem(
              "emotionEntries",
              JSON.stringify(emotionEntries)
            );
            this.showToast(
              `Emotions record saved! ${selectedEmotions.length} emotions and ${selectedTriggers.length} triggers recorded.`
            );
            this.closeMoodPopup(popup);
          } catch (e) {
            this.showToast("Failed to save emotion record: " + e.message);
          }
        } else {
          this.showToast("Please select at least one emotion");
        }
      }
    }

    // Handle activity item toggles and actions
    handleActivityAction(item) {
      const action = item.dataset.action;
      // Add visual ripple effect
      this.createRippleEffect(item);
      // Toggle activity completion state
      this.activities[action] = !this.activities[action];

      // Update visual feedback for activity
      if (this.activities[action]) {
        item.style.opacity = "0.7";
        item.querySelector(".activity-arrow").textContent = "✓";
        this.showToast("Redirecting");
      } else {
        item.style.opacity = "1";
        item.querySelector(".activity-arrow").textContent = "→";
      }

      // Handle specific activity actions
      switch (action) {
        case "save-mood":
          // Redirect to analysis page after delay
          setTimeout(() => {
            window.location.href = "analysis/index.html";
          }, 1000);
          break;
        case "how-feel":
          // Show modal for detailed emotions
          this.showModal(
            "How do you feel?",
            "Add detailed emotions and feelings to your record."
          );
          break;
        case "record-sleep":
          // Show modal for sleep logging
          this.showModal(
            "Record Sleep",
            "Log your sleep quality and duration from last night."
          );
          break;
        case "notifications":
          // Request notification permission
          this.requestNotificationPermission();
          break;
      }
    }

    // Handle navigation item clicks
    handleNavigation(navItem) {
      // Remove active state from all nav items
      document.querySelectorAll(".nav-item").forEach((nav) => {
        nav.classList.remove("active");
      });
      // Add active state to clicked nav item
      navItem.classList.add("active");
      // Add visual ripple effect
      this.createRippleEffect(navItem);
      // Show navigation toast
      const section = navItem.dataset.section;
      this.showToast(`Navigating to ${section}...`);
    }

    // Create ripple effect for visual feedback
    createRippleEffect(element) {
      const ripple = document.createElement("div");
      ripple.classList.add("ripple");
      const rect = element.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.position = "absolute";
      ripple.style.borderRadius = "50%";
      ripple.style.background = "rgba(255, 255, 255, 0.6)";
      ripple.style.transform = "scale(0)";
      ripple.style.animation = "ripple 0.6s linear";
      ripple.style.pointerEvents = "none";
      element.style.position = "relative";
      element.style.overflow = "hidden";
      element.appendChild(ripple);
      // Remove ripple after animation
      setTimeout(() => {
        ripple.remove();
      }, 600);
    }

    // Show modal with title and message
    showModal(title, message) {
      // Create modal overlay with accessibility attributes
      const overlay = document.createElement("div");
      overlay.className = "modal-overlay";
      overlay.setAttribute("role", "dialog");
      overlay.setAttribute("aria-labelledby", "modal-title");
      overlay.innerHTML = `
                <div class="modal">
                    <div class="modal-header">
                        <h3 id="modal-title">${title}</h3>
                        <button class="modal-close" aria-label="Close modal">×</button>
                    </div>
                    <div class="modal-body">
                        <p>${message}</p>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-primary" aria-label="Continue">Continue</button>
                    </div>
                </div>
            `;
      // Append modal to body and set focus
      document.body.appendChild(overlay);
      overlay.querySelector(".modal").focus();

      // Add modal styles if not already present
      if (!document.querySelector("#modal-styles")) {
        const modalStyles = document.createElement("style");
        modalStyles.id = "modal-styles";
        modalStyles.textContent = `
                    .modal-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0, 0, 0, 0.5);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 1000;
                        animation: fadeIn 0.3s ease;
                    }
                    .modal {
                        background: white;
                        border-radius: 16px;
                        max-width: 320px;
                        width: 90%;
                        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
                        animation: slideUp 0.3s ease;
                    }
                    .modal-header {
                        padding: 20px 20px 16px;
                        border-bottom: 1px solid #e2e8f0;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    .modal-header h3 {
                        font-size: 18px;
                        font-weight: 600;
                        color: #1e293b;
                    }
                    .modal-close {
                        background: none;
                        border: none;
                        font-size: 24px;
                        cursor: pointer;
                        color: #64748b;
                        padding: 0;
                        width: 32px;
                        height: 32px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 50%;
                        transition: background 0.2s ease;
                    }
                    .modal-close:hover {
                        background: #f1f5f9;
                    }
                    .modal-body {
                        padding: 16px 20px;
                    }
                    .modal-body p {
                        color: #475569;
                        line-height: 1.6;
                    }
                    .modal-footer {
                        padding: 16px 20px 20px;
                    }
                    .btn-primary {
                        width: 100%;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 12px;
                        font-size: 16px;
                        font-weight: 500;
                        cursor: pointer;
                        transition: transform 0.2s ease;
                    }
                    .btn-primary:hover {
                        transform: translateY(-1px);
                    }
                    @keyframes slideUp {
                        from { transform: translateY(20px); opacity: 0; }
                        to { transform: translateY(0); opacity: 1; }
                    }
                    .sr-only {
                        position: absolute;
                        width: 1px;
                        height: 1px;
                        padding: 0;
                        margin: -1px;
                        overflow: hidden;
                        clip: rect(0, 0, 0, 0);
                        border: 0;
                    }
                `;
        document.head.appendChild(modalStyles);
      }

      // Close modal on close button click
      overlay.querySelector(".modal-close").addEventListener("click", () => {
        overlay.remove();
      });
      // Close modal on continue button click
      overlay.querySelector(".btn-primary").addEventListener("click", () => {
        overlay.remove();
      });
      // Close modal when clicking outside
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
          overlay.remove();
        }
      });
    }

    // Show toast notification with message
    showToast(message) {
      // Prevent stacking multiple toasts
      const existingToast = document.querySelector(".toast");
      if (existingToast) return;
      const toast = document.createElement("div");
      toast.className = "toast";
      toast.textContent = message;

      // Add toast styles if not already present
      if (!document.querySelector("#toast-styles")) {
        const toastStyles = document.createElement("style");
        toastStyles.id = "toast-styles";
        toastStyles.textContent = `
                    .toast {
                        position: fixed;
                        top: 80px;
                        left: 50%;
                        transform: translateX(-50%);
                        background: rgba(0, 0, 0, 0.8);
                        color: white;
                        padding: 12px 20px;
                        border-radius: 24px;
                        font-size: 14px;
                        font-weight: 500;
                        z-index: 1001;
                        animation: toastSlide 3s ease forwards;
                        backdrop-filter: blur(10px);
                    }
                    @keyframes toastSlide {
                        0% { transform: translateX(-50%) translateY(-20px); opacity: 0; }
                        10%, 90% { transform: translateX(-50%) translateY(0); opacity: 1; }
                        100% { transform: translateX(-50%) translateY(-20px); opacity: 0; }
                    }
                `;
        document.head.appendChild(toastStyles);
      }

      // Append toast to body and remove after animation
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.remove();
      }, 3000);
    }

    // Update greeting based on time of day
    updateGreeting() {
      const hour = new Date().getHours();
      const greetingElement = document.querySelector(".greeting h1");
      if (greetingElement) {
        if (hour < 12) {
          greetingElement.textContent = `Good morning, ${this.userName}`;
        } else if (hour < 18) {
          greetingElement.textContent = `Good afternoon, ${this.userName}`;
        } else {
          greetingElement.textContent = `Good evening, ${this.userName}`;
        }
      }
    }

    // Request permission for browser notifications
    requestNotificationPermission() {
      if ("Notification" in window) {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            // Show notification if permission granted
            this.showToast("Notifications enabled!");
            new Notification("Wellness Tracker", {
              body: "You'll now receive daily wellness reminders!",
              icon: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400",
            });
          } else {
            this.showToast("Notifications permission denied");
          }
        });
      } else {
        this.showToast("Notifications not supported");
      }
    }

    // Animate UI elements for visual feedback
    animateElements() {
      // Animate cards with staggered delays
      const cards = document.querySelectorAll(
        ".calendar-section, .quick-support, .journal-section, .activities-section, .daily-tip"
      );
      cards.forEach((card, index) => {
        requestAnimationFrame(() => {
          card.style.animationDelay = `${index * 0.1}s`;
          card.style.animation = "fadeIn 0.6s ease-out forwards";
        });
      });

      // Animate mood options with staggered delays
      document.querySelectorAll(".mood-option").forEach((option, index) => {
        requestAnimationFrame(() => {
          option.style.animationDelay = `${0.5 + index * 0.1}s`;
          option.style.animation = "fadeIn 0.6s ease-out forwards";
          option.style.opacity = "0";
        });
      });
    }

    // Add haptic feedback for touch devices
    addTouchFeedback() {
      const clickableElements = document.querySelectorAll(
        ".mood-option, .day-item, .support-card, .journal-card, .activity-item, .nav-item"
      );
      clickableElements.forEach((element) => {
        element.addEventListener("touchstart", () => {
          if (navigator.vibrate) {
            navigator.vibrate(50);
          }
        });
      });
    }

    // Register service worker for PWA capabilities
    registerServiceWorker() {
      if ("serviceWorker" in navigator) {
        window.addEventListener("load", () => {
          navigator.serviceWorker
            .register("/service-worker.js")
            .then((registration) => {
              console.log(
                "Service Worker registered with scope:",
                registration.scope
              );
            })
            .catch((error) => {
              console.error("Service Worker registration failed:", error);
            });
        });
      }
    }
  }

  // Instantiate the WellnessApp
  new WellnessApp();
});
