const Vue = require('vue')

const app = new Vue({
  el: '#app',
  
  data: {
    icon: {},
    iconNext:{},
    started: true,
    score: 0,
    timePerIcon: 20000,
    time: 300000,
    answer: new Array()
  },
  
  created: function () {
    this.fetchIcon().then(data => {
      this.icon = data.icon
    })
    this.fetchIcon().then(data => {
      this.iconNext = data.icon
    })
    window.addEventListener('keyup', this.checkKey)
  },
  
  beforeDestroy: function () {
    // remove listener
  },
  
  methods: {
    
    fetchIcon: () => {
      return fetch('/icon').then(data => data.json())
    },
    
    checkKey: function (e) {
      switch (true) {
        case (e.keyCode === 8):    // backspace
          const del = this.answer.pop()
          if (del === ' '){
            this.answer.pop()
          }
          break
        case (e.keyCode === 13):    // enter
          break
        case (e.keyCode > 47 && e.keyCode < 91):
          if (this.icon.term[this.answer.length] === ' '){
            this.answer.push(' ')
          }
          this.answer.push(String.fromCharCode(e.keyCode))
          break
        default:
          break
      }
    },
    
  },
  
  template: `
    <div class="vh-100 flex flex-column items-center justify-center">
      <div class="flex flex-column items-center w-100 w-50-ns">
        <guess :term=icon.term :answer=answer></guess>
        <img class="mv2" :src=icon.preview_url />
        <img class="dn" :src=iconNext.preview_url />
      </div>
    </div>
  `
})

const guess = Vue.component('guess', {
  props: ['term', 'answer'],
  
  computed: {

  },
  
  methods: {
    outputAnswer: function(i) {
      if (i >= this.answer.length) {
        return ''
      } else {
        return this.answer[i]
      }
    },
    
    checkAnswer: function(i) {
      return i >= this.answer.length || this.term[i].toLowerCase() === this.answer[i].toLowerCase()
    }
  },
  
  template: `
    <h2>
      <span 
       v-for="(ch, i) in term" 
       class="w1 dib mh1 bw2 code fw1"
       :class="{bb: ch !== ' ', red: !checkAnswer(i)}"
      >{{ outputAnswer(i) }}
      </span>
    </h2>
    <input type="text" ></input>
  `,
})
