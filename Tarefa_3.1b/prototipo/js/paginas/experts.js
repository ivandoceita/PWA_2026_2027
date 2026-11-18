// =====================================================================
// NOVA ENTIDADE: Experts (especialistas científicos da espécie/família)
// Ecrãs: B3/M3 listagem · B4/M4 formulário de inserção e edição
// =====================================================================

const ExpertsLista = {
  components: { Avatar, DialogoConfirmar, Distintivo },
  data () { return { pesquisa: '', filtroFamilia: '', aRemover: null } },
  computed: {
    familias () { return [...new Set(bd.animais.map(a => a.familia))].sort() },
    lista () {
      const p = this.pesquisa.trim().toLowerCase()
      return bd.experts.filter(e =>
        (!p || e.nome.toLowerCase().includes(p) || e.instituicao.toLowerCase().includes(p)) &&
        (!this.filtroFamilia || e.familia === this.filtroFamilia)
      )
    }
  },
  methods: {
    nomesAnimais: util.nomesAnimais,
    titulo: util.titulo,
    pedirRemocao (e) {
      this.aRemover = e
      this.$refs.confirmar.abrir(`Tem a certeza de que quer remover o expert "${util.titulo(e)}"?`)
    },
    remover () {
      crud.remover('experts', this.aRemover.id)
      mostrarAviso(`Expert "${this.aRemover.nome}" removido.`)
    }
  },
  template: `
    <section aria-labelledby="titulo-pagina">
      <header class="cab-pagina">
        <nav class="migalhas" aria-label="Localização"><router-link to="/painel">Back-office</router-link> › Experts</nav>
        <h2 id="titulo-pagina">Gestão de Experts</h2>
        <p class="subtitulo">Especialistas científicos de cada espécie ou família de animais</p>
      </header>

      <form class="barra-filtros" role="search" @submit.prevent>
        <label class="sr-only" for="pesq-expert">Pesquisar</label>
        <input id="pesq-expert" type="search" v-model="pesquisa" placeholder="Pesquisar por nome ou instituição…">
        <label class="sr-only" for="filtro-familia">Família</label>
        <select id="filtro-familia" v-model="filtroFamilia">
          <option value="">Todas as famílias</option>
          <option v-for="f in familias" :key="f">{{ f }}</option>
        </select>
        <router-link to="/experts/novo" class="btn btn-pri empurrar">+ Novo expert</router-link>
      </form>

      <table class="tabela">
        <caption class="sr-only">Lista de especialistas científicos</caption>
        <thead>
          <tr><th scope="col">Foto</th><th scope="col">Nome</th><th scope="col">Grau</th><th scope="col">Família</th>
              <th scope="col">Instituição</th><th scope="col">Animais</th><th scope="col">Ações</th></tr>
        </thead>
        <tbody>
          <tr v-for="e in lista" :key="e.id">
            <td data-label="Foto"><avatar :nome="e.nome" :imagem="e.fotografia" :id="e.id + 2" :tamanho="38"></avatar></td>
            <td data-label="Nome"><strong>{{ titulo(e) }}</strong><br><small>{{ e.email }}</small></td>
            <td data-label="Grau">{{ e.grau }}</td>
            <td data-label="Família"><distintivo>{{ e.familia }}</distintivo></td>
            <td data-label="Instituição">{{ e.instituicao }}</td>
            <td data-label="Animais" class="realce-expert">{{ nomesAnimais(e.animais) }}</td>
            <td data-label="Ações" class="celula-acoes">
              <router-link :to="'/experts/' + e.id + '/editar'" class="btn btn-sec btn-peq">Editar</router-link>
              <button type="button" class="btn btn-perigo btn-peq" @click="pedirRemocao(e)">Remover</button>
            </td>
          </tr>
          <tr v-if="!lista.length"><td colspan="7" class="vazio">Nenhum expert corresponde aos filtros.</td></tr>
        </tbody>
      </table>
      <p class="rodape-tabela">A mostrar {{ lista.length }} de {{ $root.bd.experts.length }} experts</p>

      <dialogo-confirmar ref="confirmar" titulo="Remover expert" @confirmar="remover"></dialogo-confirmar>
    </section>`
}

const ExpertForm = {
  components: { Avatar },
  data () {
    return {
      graus: GRAUS_ACADEMICOS,
      e: { nome: '', grau: '', email: '', instituicao: '', orcid: '', fotografia: '', familia: '', animais: [], biografia: '' }
    }
  },
  created () {
    if (this.edicao) {
      const existente = crud.obter('experts', this.$route.params.id)
      if (!existente) { this.$router.replace('/experts'); return }
      this.e = JSON.parse(JSON.stringify(existente))
    }
  },
  computed: {
    edicao () { return !!this.$route.params.id },
    familias () { return [...new Set(bd.animais.map(a => a.familia))].sort() },
    // Os animais da família escolhida aparecem primeiro, como sugestão
    animaisOrdenados () {
      return [...bd.animais].sort((a, b) => (b.familia === this.e.familia) - (a.familia === this.e.familia))
    }
  },
  methods: {
    escolherFamilia () {
      // Ao escolher a família, marca automaticamente os animais dessa família
      bd.animais.filter(a => a.familia === this.e.familia)
        .forEach(a => { if (!this.e.animais.includes(a.id)) this.e.animais.push(a.id) })
    },
    guardar () {
      if (this.edicao) crud.atualizar('experts', this.e)
      else crud.inserir('experts', this.e)
      mostrarAviso(this.edicao ? 'Expert atualizado com sucesso.' : 'Expert criado com sucesso.')
      this.$router.push('/experts')
    }
  },
  template: `
    <section aria-labelledby="titulo-pagina">
      <header class="cab-pagina">
        <nav class="migalhas" aria-label="Localização">
          <router-link to="/painel">Back-office</router-link> › <router-link to="/experts">Experts</router-link> › {{ edicao ? 'Editar' : 'Novo' }}
        </nav>
        <h2 id="titulo-pagina">{{ edicao ? 'Editar expert' : 'Novo expert' }}</h2>
      </header>

      <form class="formulario" @submit.prevent="guardar">
        <div class="grelha-form">
          <fieldset class="painel">
            <legend>Dados pessoais</legend>
            <p class="campo">
              <label for="e-nome">Nome *</label>
              <input id="e-nome" v-model.trim="e.nome" required maxlength="80" autocomplete="name">
            </p>
            <p class="campo">
              <label for="e-grau">Grau académico *</label>
              <select id="e-grau" v-model="e.grau" required>
                <option value="" disabled>Selecione…</option>
                <option v-for="g in graus" :key="g">{{ g }}</option>
              </select>
            </p>
            <p class="campo">
              <label for="e-email">Email *</label>
              <input id="e-email" type="email" v-model.trim="e.email" required autocomplete="email">
            </p>
            <p class="campo">
              <label for="e-inst">Instituição *</label>
              <input id="e-inst" v-model.trim="e.instituicao" required maxlength="100" autocomplete="organization">
            </p>
            <div class="campo campo-imagem">
              <p class="campo">
                <label for="e-foto">Fotografia (URL)</label>
                <input id="e-foto" type="url" v-model.trim="e.fotografia" placeholder="https://…/foto.jpg">
              </p>
              <figure>
                <avatar :nome="e.nome || '?'" :imagem="e.fotografia" :id="(e.id || 1) + 2" :tamanho="58"></avatar>
                <figcaption class="sr-only">Pré-visualização da fotografia</figcaption>
              </figure>
            </div>
          </fieldset>

          <fieldset class="painel">
            <legend>Área científica</legend>
            <p class="campo">
              <label for="e-familia">Família de especialidade *</label>
              <select id="e-familia" v-model="e.familia" required @change="escolherFamilia">
                <option value="" disabled>Selecione…</option>
                <option v-for="f in familias" :key="f">{{ f }}</option>
              </select>
            </p>
            <fieldset class="grupo-opcoes">
              <legend>Animais que acompanha</legend>
              <label v-for="a in animaisOrdenados" :key="a.id" class="opcao">
                <input type="checkbox" :value="a.id" v-model="e.animais"> {{ a.nome }}
                <small v-if="e.familia && a.familia === e.familia" class="sugestao">sugerido</small>
              </label>
            </fieldset>
            <p class="campo">
              <label for="e-orcid">ORCID</label>
              <input id="e-orcid" v-model.trim="e.orcid" pattern="\\d{4}-\\d{4}-\\d{4}-\\d{3}[\\dX]"
                     placeholder="0000-0000-0000-0000" title="Formato: 0000-0000-0000-0000">
            </p>
            <p class="campo">
              <label for="e-bio">Biografia</label>
              <textarea id="e-bio" v-model="e.biografia" rows="3" maxlength="400"></textarea>
            </p>
            <p class="ajuda"><em>* campos obrigatórios</em></p>
          </fieldset>
        </div>
        <div class="acoes-form">
          <router-link to="/experts" class="btn btn-sec">Cancelar</router-link>
          <button type="submit" class="btn btn-pri">Guardar</button>
        </div>
      </form>
    </section>`
}
