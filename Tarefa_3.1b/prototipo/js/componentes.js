// =====================================================================
// Componentes reutilizados por várias páginas do back-office
// =====================================================================

// Logótipo ou fotografia: mostra a imagem se houver URL, senão as iniciais
const Avatar = {
  props: { nome: String, imagem: String, id: Number, tamanho: { type: Number, default: 40 }, quadrado: Boolean },
  data () { return { erro: false } },
  computed: {
    estilo () {
      return {
        width: this.tamanho + 'px', height: this.tamanho + 'px', fontSize: Math.round(this.tamanho * 0.36) + 'px',
        background: util.cor(this.id || 1), borderRadius: this.quadrado ? '8px' : '50%'
      }
    }
  },
  watch: { imagem () { this.erro = false } },
  template: `
    <span class="avatar" :style="estilo" role="img" :aria-label="nome">
      <img v-if="imagem && !erro" :src="imagem" alt="" @error="erro = true">
      <template v-else>{{ iniciais }}</template>
    </span>`,
  setup (props) {
    return { iniciais: Vue.computed(() => util.iniciais(props.nome || '?')) }
  }
}

// Janela modal de confirmação, feita com o elemento HTML5 <dialog>
const DialogoConfirmar = {
  props: { titulo: String },
  emits: ['confirmar'],
  data () { return { texto: '' } },
  methods: {
    abrir (texto) { this.texto = texto; this.$refs.dialogo.showModal() },
    fechar () { this.$refs.dialogo.close() },
    confirmar () { this.$emit('confirmar'); this.fechar() }
  },
  template: `
    <dialog ref="dialogo" class="dialogo" aria-labelledby="dialogo-titulo">
      <form method="dialog">
        <h3 id="dialogo-titulo">{{ titulo }}</h3>
        <p>{{ texto }}</p>
        <menu class="acoes">
          <button type="button" class="btn btn-sec" @click="fechar">Cancelar</button>
          <button type="button" class="btn btn-perigo-cheio" @click="confirmar">Remover</button>
        </menu>
      </form>
    </dialog>`
}

// Distintivo de estado (ativo/inativo, família, etc.)
const Distintivo = {
  props: { ok: { type: Boolean, default: true } },
  template: `<span class="distintivo" :class="ok ? 'ok' : 'off'"><slot></slot></span>`
}
