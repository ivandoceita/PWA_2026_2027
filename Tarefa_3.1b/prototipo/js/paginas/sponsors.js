// =====================================================================
// NOVA ENTIDADE: Sponsors (patrocinadores que se identificam com os animais)
// Ecrãs: B1/M1 listagem · B2/M2 formulário de inserção e edição
// =====================================================================

const SponsorsLista = {
  components: { Avatar, DialogoConfirmar, Distintivo },
  data () {
    return { pesquisa: '', filtroAnimal: '', filtroEstado: '', aRemover: null }
  },
  created () {
    // Permite chegar já filtrado a partir da ficha de um animal: #/sponsors?animal=1
    if (this.$route.query.animal) this.filtroAnimal = Number(this.$route.query.animal)
  },
  computed: {
    animais () { return bd.animais },
    lista () {
      const p = this.pesquisa.trim().toLowerCase()
      return bd.sponsors.filter(s =>
        (!p || s.nome.toLowerCase().includes(p) || s.email.toLowerCase().includes(p)) &&
        (!this.filtroAnimal || s.animais.includes(this.filtroAnimal)) &&
        (this.filtroEstado === '' || s.ativo === (this.filtroEstado === 'ativo'))
      )
    }
  },
  methods: {
    nomesAnimais: util.nomesAnimais,
    dataPT: util.dataPT,
    pedirRemocao (s) {
      this.aRemover = s
      this.$refs.confirmar.abrir(`Tem a certeza de que quer remover o sponsor "${s.nome}"? Deixará de aparecer na ficha dos animais que apoia.`)
    },
    remover () {
      crud.remover('sponsors', this.aRemover.id)
      mostrarAviso(`Sponsor "${this.aRemover.nome}" removido.`)
    }
  },
  template: `
    <section aria-labelledby="titulo-pagina">
      <header class="cab-pagina">
        <nav class="migalhas" aria-label="Localização"><router-link to="/painel">Back-office</router-link> › Sponsors</nav>
        <h2 id="titulo-pagina">Gestão de Sponsors</h2>
        <p class="subtitulo">Patrocinadores que se identificam com os animais</p>
      </header>

      <form class="barra-filtros" role="search" @submit.prevent>
        <label class="sr-only" for="pesq-sponsor">Pesquisar</label>
        <input id="pesq-sponsor" type="search" v-model="pesquisa" placeholder="Pesquisar por nome ou email…">
        <label class="sr-only" for="filtro-animal">Animal</label>
        <select id="filtro-animal" v-model="filtroAnimal">
          <option value="">Todos os animais</option>
          <option v-for="a in animais" :key="a.id" :value="a.id">{{ a.nome }}</option>
        </select>
        <label class="sr-only" for="filtro-estado">Estado</label>
        <select id="filtro-estado" v-model="filtroEstado">
          <option value="">Todos os estados</option>
          <option value="ativo">Ativos</option>
          <option value="inativo">Inativos</option>
        </select>
        <router-link to="/sponsors/novo" class="btn btn-pri empurrar">+ Novo sponsor</router-link>
      </form>

      <table class="tabela">
        <caption class="sr-only">Lista de patrocinadores registados</caption>
        <thead>
          <tr><th scope="col">Logótipo</th><th scope="col">Nome</th><th scope="col">Tipo</th>
              <th scope="col">Animais patrocinados</th><th scope="col">Início</th><th scope="col">Estado</th><th scope="col">Ações</th></tr>
        </thead>
        <tbody>
          <tr v-for="s in lista" :key="s.id">
            <td data-label="Logótipo"><avatar :nome="s.nome" :imagem="s.logotipo" :id="s.id" quadrado :tamanho="38"></avatar></td>
            <td data-label="Nome"><strong>{{ s.nome }}</strong><br><small>{{ s.email }}</small></td>
            <td data-label="Tipo">{{ s.tipo }}</td>
            <td data-label="Animais" class="realce-sponsor">{{ nomesAnimais(s.animais) }}</td>
            <td data-label="Início"><time :datetime="s.inicio">{{ dataPT(s.inicio) }}</time></td>
            <td data-label="Estado"><distintivo :ok="s.ativo">{{ s.ativo ? 'Ativo' : 'Inativo' }}</distintivo></td>
            <td data-label="Ações" class="celula-acoes">
              <router-link :to="'/sponsors/' + s.id + '/editar'" class="btn btn-sec btn-peq">Editar</router-link>
              <button type="button" class="btn btn-perigo btn-peq" @click="pedirRemocao(s)">Remover</button>
            </td>
          </tr>
          <tr v-if="!lista.length"><td colspan="7" class="vazio">Nenhum sponsor corresponde aos filtros.</td></tr>
        </tbody>
      </table>
      <p class="rodape-tabela">A mostrar {{ lista.length }} de {{ $root.bd.sponsors.length }} sponsors</p>

      <dialogo-confirmar ref="confirmar" titulo="Remover sponsor" @confirmar="remover"></dialogo-confirmar>
    </section>`
}

const SponsorForm = {
  components: { Avatar },
  data () {
    return {
      tipos: TIPOS_SPONSOR,
      s: { nome: '', tipo: '', email: '', website: '', logotipo: '', animais: [], inicio: new Date().toISOString().slice(0, 10), ativo: true, mensagem: '' },
      erroAnimais: false
    }
  },
  created () {
    if (this.edicao) {
      const existente = crud.obter('sponsors', this.$route.params.id)
      if (!existente) { this.$router.replace('/sponsors'); return }
      this.s = JSON.parse(JSON.stringify(existente))
    } else if (this.$route.query.animal) {
      // Vindo da ficha de um animal: esse animal já fica marcado
      this.s.animais = [Number(this.$route.query.animal)]
    }
  },
  computed: {
    edicao () { return !!this.$route.params.id },
    animais () { return bd.animais }
  },
  methods: {
    guardar () {
      // As validações de campo (required, email, url) são feitas pelo próprio browser (HTML5).
      // Aqui só se valida a regra que o HTML não cobre: pelo menos um animal.
      if (!this.s.animais.length) { this.erroAnimais = true; return }
      if (this.edicao) crud.atualizar('sponsors', this.s)
      else crud.inserir('sponsors', this.s)
      mostrarAviso(this.edicao ? 'Sponsor atualizado com sucesso.' : 'Sponsor criado com sucesso.')
      this.$router.push('/sponsors')
    }
  },
  template: `
    <section aria-labelledby="titulo-pagina">
      <header class="cab-pagina">
        <nav class="migalhas" aria-label="Localização">
          <router-link to="/painel">Back-office</router-link> › <router-link to="/sponsors">Sponsors</router-link> › {{ edicao ? 'Editar' : 'Novo' }}
        </nav>
        <h2 id="titulo-pagina">{{ edicao ? 'Editar sponsor' : 'Novo sponsor' }}</h2>
      </header>

      <form class="formulario" @submit.prevent="guardar">
        <div class="grelha-form">
          <fieldset class="painel">
            <legend>Dados do patrocinador</legend>
            <p class="campo">
              <label for="s-nome">Nome *</label>
              <input id="s-nome" v-model.trim="s.nome" required maxlength="80" autocomplete="organization">
            </p>
            <p class="campo">
              <label for="s-tipo">Tipo *</label>
              <select id="s-tipo" v-model="s.tipo" required>
                <option value="" disabled>Selecione…</option>
                <option v-for="t in tipos" :key="t">{{ t }}</option>
              </select>
            </p>
            <p class="campo">
              <label for="s-email">Email *</label>
              <input id="s-email" type="email" v-model.trim="s.email" required autocomplete="email">
            </p>
            <p class="campo">
              <label for="s-website">Website</label>
              <input id="s-website" type="url" v-model.trim="s.website" placeholder="https://">
            </p>
            <div class="campo campo-imagem">
              <p class="campo">
                <label for="s-logo">Logótipo (URL da imagem)</label>
                <input id="s-logo" type="url" v-model.trim="s.logotipo" placeholder="https://…/logo.png">
              </p>
              <figure>
                <avatar :nome="s.nome || '?'" :imagem="s.logotipo" :id="s.id || 1" quadrado :tamanho="58"></avatar>
                <figcaption class="sr-only">Pré-visualização do logótipo</figcaption>
              </figure>
            </div>
            <p class="ajuda">O logótipo aparece na listagem e na ficha dos animais patrocinados.</p>
          </fieldset>

          <fieldset class="painel">
            <legend>Patrocínio</legend>
            <fieldset class="grupo-opcoes" :class="{ erro: erroAnimais }">
              <legend>Animais patrocinados *</legend>
              <label v-for="a in animais" :key="a.id" class="opcao">
                <input type="checkbox" :value="a.id" v-model="s.animais" @change="erroAnimais = false"> {{ a.nome }}
              </label>
              <p v-if="erroAnimais" class="msg-erro" role="alert">Escolha pelo menos um animal.</p>
            </fieldset>
            <div class="linha-2">
              <p class="campo">
                <label for="s-inicio">Data de início *</label>
                <input id="s-inicio" type="date" v-model="s.inicio" required>
              </p>
              <p class="campo">
                <span class="rotulo" id="s-estado-rot">Estado</span>
                <label class="interruptor">
                  <input type="checkbox" v-model="s.ativo" aria-labelledby="s-estado-rot">
                  <span class="trilho"></span> {{ s.ativo ? 'Ativo' : 'Inativo' }}
                </label>
              </p>
            </div>
            <p class="campo">
              <label for="s-msg">Mensagem de apoio</label>
              <textarea id="s-msg" v-model="s.mensagem" rows="4" maxlength="300"></textarea>
            </p>
            <p class="ajuda"><em>* campos obrigatórios</em></p>
          </fieldset>
        </div>
        <div class="acoes-form">
          <router-link to="/sponsors" class="btn btn-sec">Cancelar</router-link>
          <button type="submit" class="btn btn-pri">Guardar</button>
        </div>
      </form>
    </section>`
}
