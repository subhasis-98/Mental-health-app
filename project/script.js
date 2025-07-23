class WellnessApp {
  constructor() {
    this.selectedMood = "very-happy";
    this.selectedDay = 22;
    this.activities = {
      "save-mood": false,
      "how-feel": false,
      "record-sleep": false,
      notifications: false,
    };

    this.init();
  }

  init() {
    this.bindEventListeners();
    this.updateGreeting();
    this.animateElements();
  }

  bindEventListeners() {
    // Mood selector
    document.querySelectorAll(".mood-option").forEach((option) => {
      option.addEventListener("click", (e) => this.selectMood(e.target));
    });

    // Calendar days
    document.querySelectorAll(".day-item").forEach((day) => {
      day.addEventListener("click", (e) => this.selectDay(e.currentTarget));
    });

    // Support cards
    document.querySelectorAll(".support-card").forEach((card) => {
      card.addEventListener("click", (e) =>
        this.handleSupportAction(e.currentTarget)
      );
    });

    // Journal cards
    document.querySelectorAll(".journal-card").forEach((card) => {
      card.addEventListener("click", (e) =>
        this.handleJournalAction(e.currentTarget)
      );
    });

    // Activity items
    document.querySelectorAll(".activity-item").forEach((item) => {
      item.addEventListener("click", (e) =>
        this.handleActivityAction(e.currentTarget)
      );
    });

    // Bottom navigation
    document.querySelectorAll(".nav-item").forEach((nav) => {
      nav.addEventListener("click", (e) =>
        this.handleNavigation(e.currentTarget)
      );
    });

    // Add touch feedback for mobile
    this.addTouchFeedback();
  }

  selectMood(moodElement) {
    // Remove previous selection
    document.querySelectorAll(".mood-option").forEach((opt) => {
      opt.classList.remove("selected");
    });

    // Add selection to clicked mood
    moodElement.classList.add("selected");
    this.selectedMood = moodElement.dataset.mood;

    // Add ripple effect
    this.createRippleEffect(moodElement);

    // Show feedback
    this.showToast(`Mood "${this.selectedMood}" recorded!`);
  }

  selectDay(dayElement) {
    // Remove previous selection
    document.querySelectorAll(".day-item").forEach((day) => {
      day.classList.remove("active");
    });

    // Add selection to clicked day
    dayElement.classList.add("active");
    this.selectedDay = parseInt(
      dayElement.querySelector(".day-number").textContent
    );

    // Add ripple effect
    this.createRippleEffect(dayElement);
  }

  handleSupportAction(card) {
    const action = card.dataset.action;
    this.createRippleEffect(card);

    switch (action) {
      case "coping-cards":
        this.showModal(
          "Coping Cards",
          "Access your personalized coping strategies and techniques."
        );
        break;
      case "emergency-help":
        this.showModal(
          "Emergency Help",
          "Immediate support resources and crisis helplines are available 24/7."
        );
        break;
    }
  }

  handleJournalAction(card) {
    const action = card.dataset.action;
    this.createRippleEffect(card);

    switch (action) {
      case "mood-record":
        this.showMoodRecordPopup();
        break;
      case "diary-record":
        this.showModal(
          "Diary Record",
          "Write about your day and capture important moments."
        );
        break;
      case "meditation":
        this.showMeditationPopup();
        break;
    }
  }

  showMoodRecordPopup() {
    const popup = document.createElement("div");
    popup.className = "mood-popup-overlay";
    popup.innerHTML = `
            <div class="mood-popup">
                <div class="mood-popup-header">
                    <button class="mood-popup-close">&times;</button>
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
                                <div class="emotion-item" data-emotion="delighted">
                                    <div class="emotion-emoji">😊</div>
                                    <span>Delighted</span>
                                </div>
                                <div class="emotion-item" data-emotion="happy">
                                    <div class="emotion-emoji">😄</div>
                                    <span>Happy</span>
                                </div>
                                <div class="emotion-item" data-emotion="inspired">
                                    <div class="emotion-emoji">🤩</div>
                                    <span>Inspired</span>
                                </div>
                                <div class="emotion-item" data-emotion="empathic">
                                    <div class="emotion-emoji">🥺</div>
                                    <span>Empathic</span>
                                </div>
                                <div class="emotion-item" data-emotion="cheerful">
                                    <div class="emotion-emoji">😆</div>
                                    <span>Cheerful</span>
                                </div>
                                
                                <div class="emotion-item" data-emotion="content">
                                    <div class="emotion-emoji">😌</div>
                                    <span>Content</span>
                                </div>
                                <div class="emotion-item" data-emotion="amused">
                                    <div class="emotion-emoji">😄</div>
                                    <span>Amused</span>
                                </div>
                                <div class="emotion-item" data-emotion="peaceful">
                                    <div class="emotion-emoji">😇</div>
                                    <span>Peaceful</span>
                                </div>
                                <div class="emotion-item" data-emotion="interested">
                                    <div class="emotion-emoji">🤔</div>
                                    <span>Interested</span>
                                </div>
                                <div class="emotion-item" data-emotion="hopeful">
                                    <div class="emotion-emoji">🙂</div>
                                    <span>Hopeful</span>
                                </div>
                                
                                <div class="emotion-item" data-emotion="trusting">
                                    <div class="emotion-emoji">😊</div>
                                    <span>Trusting</span>
                                </div>
                                <div class="emotion-item" data-emotion="enthusiast">
                                    <div class="emotion-emoji">🤗</div>
                                    <span>Enthusiast</span>
                                </div>
                                <div class="emotion-item" data-emotion="curious">
                                    <div class="emotion-emoji">🤨</div>
                                    <span>Curious</span>
                                </div>
                                <div class="emotion-item" data-emotion="serene">
                                    <div class="emotion-emoji">😌</div>
                                    <span>Serene</span>
                                </div>
                                <div class="emotion-item" data-emotion="blessed">
                                    <div class="emotion-emoji">🙏</div>
                                    <span>Blessed</span>
                                </div>
                                
                                <div class="emotion-item" data-emotion="neutral">
                                    <div class="emotion-emoji">😐</div>
                                    <span>Neutral</span>
                                </div>
                                <div class="emotion-item" data-emotion="indifferent">
                                    <div class="emotion-emoji">😑</div>
                                    <span>Indifferent</span>
                                </div>
                                <div class="emotion-item" data-emotion="fine">
                                    <div class="emotion-emoji">🙂</div>
                                    <span>Fine</span>
                                </div>
                                <div class="emotion-item" data-emotion="relaxed">
                                    <div class="emotion-emoji">😎</div>
                                    <span>Relaxed</span>
                                </div>
                                <div class="emotion-item" data-emotion="calm">
                                    <div class="emotion-emoji">😌</div>
                                    <span>Calm</span>
                                </div>
                                
                                <div class="emotion-item" data-emotion="angry">
                                    <div class="emotion-emoji">😠</div>
                                    <span>Angry</span>
                                </div>
                                <div class="emotion-item" data-emotion="resentful">
                                    <div class="emotion-emoji">😤</div>
                                    <span>Resentful</span>
                                </div>
                                <div class="emotion-item" data-emotion="hateful">
                                    <div class="emotion-emoji">😡</div>
                                    <span>Hateful</span>
                                </div>
                                <div class="emotion-item" data-emotion="regretful">
                                    <div class="emotion-emoji">😞</div>
                                    <span>Regretful</span>
                                </div>
                                <div class="emotion-item" data-emotion="hostile">
                                    <div class="emotion-emoji">😾</div>
                                    <span>Hostile</span>
                                </div>
                                
                                <div class="emotion-item" data-emotion="grieving">
                                    <div class="emotion-emoji">😢</div>
                                    <span>Grieving</span>
                                </div>
                                <div class="emotion-item" data-emotion="heartbroken">
                                    <div class="emotion-emoji">💔</div>
                                    <span>Heartbroken</span>
                                </div>
                                <div class="emotion-item" data-emotion="sorrowful">
                                    <div class="emotion-emoji">😭</div>
                                    <span>Sorrowful</span>
                                </div>
                                <div class="emotion-item" data-emotion="depressed">
                                    <div class="emotion-emoji">😔</div>
                                    <span>Depressed</span>
                                </div>
                                <div class="emotion-item" data-emotion="shaming">
                                    <div class="emotion-emoji">😳</div>
                                    <span>Shaming</span>
                                </div>
                                
                                <div class="emotion-item" data-emotion="furious">
                                    <div class="emotion-emoji">🤬</div>
                                    <span>Furious</span>
                                </div>
                                <div class="emotion-item" data-emotion="miserable">
                                    <div class="emotion-emoji">😩</div>
                                    <span>Miserable</span>
                                </div>
                                <div class="emotion-item" data-emotion="hopeless">
                                    <div class="emotion-emoji">😰</div>
                                    <span>Hopeless</span>
                                </div>
                                <div class="emotion-item" data-emotion="threatening">
                                    <div class="emotion-emoji">😈</div>
                                    <span>Threatening</span>
                                </div>
                                <div class="emotion-item" data-emotion="unhappy">
                                    <div class="emotion-emoji">☹️</div>
                                    <span>Unhappy</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="triggers-section">
                            <h3>Triggers</h3>
                            <div class="triggers-grid">
                                <div class="trigger-item" data-trigger="relationship">
                                    <div class="trigger-icon">💙</div>
                                    <span>Relationship</span>
                                </div>
                                <div class="trigger-item" data-trigger="work">
                                    <div class="trigger-icon">💼</div>
                                    <span>Work</span>
                                </div>
                                <div class="trigger-item" data-trigger="family">
                                    <div class="trigger-icon">👨‍👩‍👧‍👦</div>
                                    <span>Family</span>
                                </div>
                                <div class="trigger-item" data-trigger="finance">
                                    <div class="trigger-icon">💰</div>
                                    <span>Finance</span>
                                </div>
                                <div class="trigger-item" data-trigger="health">
                                    <div class="trigger-icon">🏥</div>
                                    <span>Health</span>
                                </div>
                                
                                <div class="trigger-item" data-trigger="food">
                                    <div class="trigger-icon">🍽️</div>
                                    <span>Food</span>
                                </div>
                                <div class="trigger-item" data-trigger="pet">
                                    <div class="trigger-icon">🐾</div>
                                    <span>Pet</span>
                                </div>
                                <div class="trigger-item" data-trigger="nature">
                                    <div class="trigger-icon">🌿</div>
                                    <span>Nature</span>
                                </div>
                                <div class="trigger-item" data-trigger="art">
                                    <div class="trigger-icon">🎨</div>
                                    <span>Art</span>
                                </div>
                                <div class="trigger-item" data-trigger="exercise">
                                    <div class="trigger-icon">🏃‍♂️</div>
                                    <span>Exercise</span>
                                </div>
                                
                                <div class="trigger-item" data-trigger="meditation">
                                    <div class="trigger-icon">🧘‍♀️</div>
                                    <span>Meditation</span>
                                </div>
                                <div class="trigger-item" data-trigger="learning">
                                    <div class="trigger-icon">📚</div>
                                    <span>Learning</span>
                                </div>
                                <div class="trigger-item" data-trigger="community">
                                    <div class="trigger-icon">🤝</div>
                                    <span>Community</span>
                                </div>
                                <div class="trigger-item" data-trigger="hobby">
                                    <div class="trigger-icon">🎯</div>
                                    <span>Hobby</span>
                                </div>
                                <div class="trigger-item" data-trigger="friendship">
                                    <div class="trigger-icon">👫</div>
                                    <span>Friendship</span>
                                </div>
                            </div>
                        </div>
                        
                        <button class="mood-save-btn">Save</button>
                    </div>
                </div>
            </div>
        `;

    document.body.appendChild(popup);

    // Add event listeners for the popup
    this.bindMoodPopupEvents(popup);

    // Animate popup in
    setTimeout(() => {
      popup.classList.add("active");
    }, 10);
  }

  bindMoodPopupEvents(popup) {
    // Close popup
    popup.querySelector(".mood-popup-close").addEventListener("click", () => {
      this.closeMoodPopup(popup);
    });

    popup.addEventListener("click", (e) => {
      if (e.target === popup) {
        this.closeMoodPopup(popup);
      }
    });

    // Tab switching
    popup.querySelectorAll(".mood-tab").forEach((tab) => {
      tab.addEventListener("click", (e) => {
        this.switchMoodTab(e.target.dataset.tab, popup);
      });
    });

    // Mood emoji selection
    popup.querySelectorAll(".mood-emoji").forEach((emoji) => {
      emoji.addEventListener("click", (e) => {
        popup
          .querySelectorAll(".mood-emoji")
          .forEach((em) => em.classList.remove("selected"));
        e.target.classList.add("selected");
      });
    });

    // Color selection
    popup.querySelectorAll(".color-option").forEach((color) => {
      color.addEventListener("click", (e) => {
        popup
          .querySelectorAll(".color-option")
          .forEach((c) => c.classList.remove("selected"));
        e.target.classList.add("selected");
      });
    });

    // Emotion selection
    popup.querySelectorAll(".emotion-item").forEach((emotion) => {
      emotion.addEventListener("click", (e) => {
        e.currentTarget.classList.toggle("selected");
      });
    });

    // Trigger selection
    popup.querySelectorAll(".trigger-item").forEach((trigger) => {
      trigger.addEventListener("click", (e) => {
        e.currentTarget.classList.toggle("selected");
      });
    });

    // Save button
    popup.querySelectorAll(".mood-save-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.saveMoodRecord(popup);
      });
    });
  }

  switchMoodTab(tabName, popup) {
    // Update tab buttons
    popup.querySelectorAll(".mood-tab").forEach((tab) => {
      tab.classList.remove("active");
    });
    popup.querySelector(`[data-tab="${tabName}"]`).classList.add("active");

    // Update views
    popup.querySelectorAll(".mood-view").forEach((view) => {
      view.classList.remove("active");
    });
    popup.querySelector(`#${tabName}-view`).classList.add("active");
  }

  closeMoodPopup(popup) {
    popup.classList.remove("active");
    setTimeout(() => {
      popup.remove();
    }, 300);
  }

  showMeditationPopup() {
    const popup = document.createElement("div");
    popup.className = "meditation-popup-overlay";
    popup.innerHTML = `
            <div class="meditation-popup">
                <div class="meditation-popup-header">
                    <button class="meditation-popup-close">&times;</button>
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

    document.body.appendChild(popup);

    // Add event listeners for the popup
    this.bindMeditationPopupEvents(popup);

    // Animate popup in
    setTimeout(() => {
      popup.classList.add("active");
    }, 10);
  }

  bindMeditationPopupEvents(popup) {
    // Close popup
    popup
      .querySelector(".meditation-popup-close")
      .addEventListener("click", () => {
        this.closeMeditationPopup(popup);
      });

    popup.addEventListener("click", (e) => {
      if (e.target === popup) {
        this.closeMeditationPopup(popup);
      }
    });

    // Duration selection
    popup.querySelectorAll(".duration-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        popup
          .querySelectorAll(".duration-btn")
          .forEach((b) => b.classList.remove("selected"));
        e.target.classList.add("selected");
      });
    });

    // Sound selection
    popup.querySelectorAll(".sound-option").forEach((option) => {
      option.addEventListener("click", (e) => {
        const radio = option.querySelector('input[type="radio"]');
        radio.checked = true;

        // Update visual selection
        popup.querySelectorAll(".sound-option").forEach((opt) => {
          opt.classList.remove("selected");
        });
        option.classList.add("selected");
      });
    });

    // Start meditation button
    popup
      .querySelector(".meditation-start-btn")
      .addEventListener("click", () => {
        const selectedDuration = popup.querySelector(".duration-btn.selected");
        const selectedSound = popup.querySelector(
          'input[name="meditation-sound"]:checked'
        );

        if (selectedDuration && selectedSound) {
          const duration = selectedDuration.dataset.duration;
          const sound = selectedSound.value;
          this.startMeditation(duration, sound);
          this.closeMeditationPopup(popup);
        } else {
          this.showToast("Please select duration and sound");
        }
      });
  }

  closeMeditationPopup(popup) {
    popup.classList.remove("active");
    setTimeout(() => {
      popup.remove();
    }, 300);
  }

  startMeditation(duration, sound) {
    this.showToast(
      `Starting ${duration} minute meditation with ${
        sound === "none" ? "no sound" : sound + " sounds"
      }`
    );
    // Here you would implement the actual meditation timer and sound playback
  }

  saveMoodRecord(popup) {
    const activeTab = popup.querySelector(".mood-tab.active").dataset.tab;

    if (activeTab === "mood") {
      const selectedMood = popup.querySelector(".mood-emoji.selected");
      const selectedColor = popup.querySelector(".color-option.selected");
      const moodText = popup.querySelector("textarea").value;

      if (selectedMood) {
        this.showToast("Mood record saved successfully!");
        this.closeMoodPopup(popup);
      } else {
        this.showToast("Please select a mood first");
      }
    } else {
      const selectedEmotions = popup.querySelectorAll(".emotion-item.selected");
      const selectedTriggers = popup.querySelectorAll(".trigger-item.selected");

      if (selectedEmotions.length > 0) {
        this.showToast(
          `Emotions record saved! ${selectedEmotions.length} emotions and ${selectedTriggers.length} triggers recorded.`
        );
        this.closeMoodPopup(popup);
      } else {
        this.showToast("Please select at least one emotion");
      }
    }
  }

  handleActivityAction(item) {
    const action = item.dataset.action;
    this.createRippleEffect(item);

    // Toggle activity completion
    this.activities[action] = !this.activities[action];

    if (this.activities[action]) {
      item.style.opacity = "0.7";
      item.querySelector(".activity-arrow").textContent = "✓";
      this.showToast("Redirecting");
    } else {
      item.style.opacity = "1";
      item.querySelector(".activity-arrow").textContent = "→";
    }

    switch (action) {
      // case 'save-mood':
      //     this.showModal('Save Mood', 'Your current mood has been saved to your journal.');
      //     break;

      case "save-mood":
        this.showModal(
          "Check Your Stress Level",
          "Redirecting you to a quick stress check..."
        );

        // Redirect after 1.5 seconds (1500 ms)
        setTimeout(() => {
          window.location.href = "analysis/index.html"; // Change to your desired page
        }, 2000);
        break;

      case "how-feel":
        this.showModal(
          "How do you feel?",
          "Add detailed emotions and feelings to your record."
        );
        break;
      case "record-sleep":
        this.showModal(
          "Record Sleep",
          "Log your sleep quality and duration from last night."
        );
        break;
      case "notifications":
        this.requestNotificationPermission();
        break;
    }
  }

  handleNavigation(navItem) {
    // Remove previous active state
    document.querySelectorAll(".nav-item").forEach((nav) => {
      nav.classList.remove("active");
    });

    // Add active state to clicked nav
    navItem.classList.add("active");
    this.createRippleEffect(navItem);

    const section = navItem.dataset.section;
    this.showToast(`Navigating to ${section}...`);
  }

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

    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  showModal(title, message) {
    // Create modal overlay
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p>${message}</p>
                </div>
                <div class="modal-footer">
                    <button class="btn-primary">Continue</button>
                </div>
            </div>
        `;

    document.body.appendChild(overlay);

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
                    from {
                        transform: translateY(20px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
            `;
      document.head.appendChild(modalStyles);
    }

    // Close modal events
    overlay.querySelector(".modal-close").addEventListener("click", () => {
      overlay.remove();
    });

    overlay.querySelector(".btn-primary").addEventListener("click", () => {
      overlay.remove();
    });

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        overlay.remove();
      }
    });
  }

  showToast(message) {
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
                    0% {
                        transform: translateX(-50%) translateY(-20px);
                        opacity: 0;
                    }
                    10%, 90% {
                        transform: translateX(-50%) translateY(0);
                        opacity: 1;
                    }
                    100% {
                        transform: translateX(-50%) translateY(-20px);
                        opacity: 0;
                    }
                }
            `;
      document.head.appendChild(toastStyles);
    }

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  updateGreeting() {
    const hour = new Date().getHours();
    const greetingElement = document.querySelector(".greeting h1");

    if (hour < 12) {
      greetingElement.textContent = "Good morning, subhasis";
    } else if (hour < 18) {
      greetingElement.textContent = "Good afternoon, subhasis";
    } else {
      greetingElement.textContent = "Good evening, subhasis";
    }
  }

  requestNotificationPermission() {
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
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

  animateElements() {
    // Stagger animation for cards
    const cards = document.querySelectorAll(
      ".calendar-section, .quick-support, .journal-section, .activities-section, .daily-tip"
    );
    cards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`;
    });

    // Animate mood options
    document.querySelectorAll(".mood-option").forEach((option, index) => {
      option.style.animationDelay = `${0.5 + index * 0.1}s`;
      option.style.animation = "fadeIn 0.6s ease-out forwards";
      option.style.opacity = "0";
    });
  }

  addTouchFeedback() {
    // Add haptic feedback for supported devices
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
}

// Add ripple animation styles
const rippleStyles = document.createElement("style");
rippleStyles.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyles);

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new WellnessApp();
});

// Add service worker registration for PWA capabilities
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}
