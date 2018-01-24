const Vue = require('vue')

const app = new Vue({
  el: '#app',

  data: {
    icon: {},
    iconNext: {},
    msg: '',
    started: false,
    score: 0,
    time: 180,
    answer: []
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
        case (e.keyCode === 8):    // backspace
          const del = this.answer.pop()
          if (del === ' ') {
            this.answer.pop()
          }
          break
        case (e.keyCode === 13):    // enter
          this.nextRound()
          break
        case (e.keyCode === 32):
          this.startGame()
          break
        case (e.keyCode > 47 && e.keyCode < 91 && this.answer.length < this.icon.term.length):
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
      if (this.started) {
        return
      }
      this.started = true
      const timer = setInterval(() => {
        console.log(this.time)
        if (--this.time === 0) {
          clearInterval(timer)
          this.gameOver()
        }
      }, 1000)
    },

    gameOver: function () {
      this.started = false
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
      <div :class="{flex: started}" class="dn flex-column items-center pa4 mw6 w-100 w-50-ns">
        <guess :term=icon.term :answer=answer></guess>
        <img class="mv2" :src=icon.preview_url />
        <img class="dn" :src=iconNext.preview_url />
        <dashboard :score=score :time=time></dashboard>
      </div>
    </div>
  `
})

Vue.component('guess', {
  props: ['term', 'answer'],

  methods: {
    outputAnswer: function (i) {
      if (i >= this.answer.length) {
        return ''
      } else {
        return this.answer[i]
      }
    },

    isCorrect: function (i) {
      return i >= this.answer.length || this.term[i].toLowerCase() === this.answer[i].toLowerCase()
    }
  },

  template: `
    <h2 class="mb4">
      <span
       v-for="(char, i) in term"
       class="w1 dib mh1 bw2 blank nowrap tc"
       :class="{bb: char !== ' ', red: !isCorrect(i)}"
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
