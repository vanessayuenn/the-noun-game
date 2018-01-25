const Vue = require('vue')

const app = new Vue({
  el: '#app',

  data: {
    icon: {},
    iconNext: {},
    isGameover: false,
    isStarted: false,
    score: 0,
    time: 180,
    answer: [],
    showAnswer: false
  },

  created: function () {
    this.fetchIcon().then(icon => { this.icon = icon })
    this.fetchIcon().then(icon => { this.iconNext = icon })
    window.addEventListener('keyup', this.checkKey)
  },

  beforeDestroy: function () {
    // remove listener
  },

  methods: {

    fetchIcon: function () {
      return fetch('/icon')
            .then((data) => data.json())
            .then((data) => {
              let { term, preview_url } = data.icon
              term = term.trim()
              return { term, preview_url }
            })
    },

    checkKey: function (e) {
      switch (true) {
        case (e.keyCode === 8):     // backspace
          const del = this.answer.pop()
          if (del === ' ') {
            this.answer.pop()
          }
          break
        case (e.keyCode === 13):    // enter
          this.showAnswer = true
          setTimeout(() => {
            this.showAnswer = false
            this.nextRound()
          }, 300)
          break
        case (e.keyCode === 32):    // space
          if (this.isGameover) {
            this.restart()
          } else {
            this.startGame()
          }
          break
        case (e.keyCode > 47 && e.keyCode < 91 &&      // alphanumerical keys
              this.answer.length < this.icon.term.length):
          if (this.icon.term[this.answer.length] === ' ') {
            this.answer.push(' ')
          }
          this.answer.push(String.fromCharCode(e.keyCode))
          break
        default:
          break
      }

      if (this.answer.length === this.icon.term.length) {
        this.checkAnswer()
      }
    },

    startGame: function () {
      if (this.isStarted) {
        return
      }
      this.isStarted = true
      const timer = setInterval(() => {
        if (--this.time === 0) {
          clearInterval(timer)
          this.gameOver()
        }
      }, 1000)
    },

    restart: function () {
      Object.assign(this, {
        isGameover: false,
        score: 0,
        time: 180,
        answer: []
      })
      this.nextRound()
      this.startGame()
    },

    gameOver: function () {
      this.isStarted = false
      this.isGameover = true
    },

    checkAnswer: function () {
      if (this.answer.join('').toLowerCase() === this.icon.term.toLowerCase()) {
        this.score++
        setTimeout(this.nextRound, 150)
      }
    },

    nextRound: function () {
      if (Object.keys(this.iconNext).length > 0) {
        this.icon = this.iconNext
      }
      this.fetchIcon().then(icon => { this.iconNext = icon })
      this.answer = []
    }

  },

  template: `
    <div class="vh-100 flex flex-column items-center justify-center">
      <div class="flex flex-column items-center justify-between pa3 mw6 w-100 w-50-ns relative overflow-hidden">
        <cover :isStarted=isStarted :isGameover=isGameover :score=score></cover>
        <guess :term=icon.term :answer=answer :showAnswer=showAnswer></guess>
        <img class="mv2" :src=icon.preview_url />
        <img class="dn" :src=iconNext.preview_url />
        <dashboard :score=score :time=time></dashboard>
      </div>
      <div class="flex justify-end ph3 w-100 w-50-ns mw6">
        <a href="https://github.com/vanessayuenn/the-noun-game" class="mh1 no-underline link black-30 hover-dark-gray">gh</a>
        <a href="https://www.twitter.com/vanessayuenn" class="mh1 no-underline link black-30 hover-dark-gray">tw</a>
      </div>
    </div>
  `
})

Vue.component('guess', {
  props: ['term', 'answer', 'showAnswer'],

  methods: {
    outputAnswer: function (i) {
      if (this.showAnswer) {
        return this.term[i].toUpperCase()
      }
      if (i >= this.answer.length) {
        return ''
      }
      return this.answer[i]
    },

    isCorrect: function (i) {
      return i >= this.answer.length ||
            this.term[i].toLowerCase() === this.answer[i].toLowerCase()
    }
  },

  template: `
    <h2 class="mb4">
      <span
       v-for="(char, i) in term"
       class="w1 dib mh1 bw2 blank nowrap tc"
       :class="{bb: char !== ' ', red: !isCorrect(i) || showAnswer}"
      >{{ outputAnswer(i) }}
      </span>
    </h2>
    <input type="text" ></input>
  `
})

Vue.component('dashboard', {
  props: ['score', 'time'],

  filters: {
    formatTime: function (sec) {
      const mm = Math.floor(sec / 60)
      const ss = Math.floor(sec % 60)
      return `${mm < 10 ? '0' + mm : mm}:${ss < 10 ? '0' + ss : ss}`
    }
  },

  template: `
    <div class="flex justify-between mt4 w-100">
      <h2>Score: {{ score }}</h2>
      <h2>{{ time | formatTime }}</h2>
    </div>
  `
})

Vue.component('cover', {
  props: ['isStarted', 'isGameover', 'score'],

  computed: {
    message: function () {
      if (!this.isGameover) {
        return `Press space to start<br />Press enter to skip`
      } else {
        return `Fin.<br />Score: ${this.score}`
      }
    }
  },

  template: `
    <div :class="{hidden: isStarted}" class="cover flex items-center tc justify-center aspect-ratio--object w-100 overflow-hidden">
      <h3 :class="{dn: isStarted}" class="tracked lh-title" v-html=message></h3>
    </div>
  `
})
