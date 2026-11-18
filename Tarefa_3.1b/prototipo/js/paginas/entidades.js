// =====================================================================
// Páginas das entidades que já existiam no Animalec (versão simplificada
// para o protótipo) e páginas de suporte: login, painel e erro 404.
// =====================================================================

const PALAVRA_PASSE = 'pwa2026'

const Login = {
  data () { return { email: 'admin@animalec.pt', password: '', erro: '' } },
  methods: {
    entrar () {
      if (this.password !== PALAVRA_PASSE) { this.erro = 'Password incorreta.'; return }
      sessionStorage.setItem('animalec-sessao', this.email)
      this.$router.push(this.$route.query.voltar || '/painel')
    }
  },
  template: `
    <main class="ecra-login">
      <section class="caixa-login" aria-labelledby="titulo-login">
        <header>
          <span class="logo" aria-hidden="true">A</span>
          <h1 id="titulo-login">Animalec</h1>
          <p>Página de Administração</p>
        </header>
        <form @submit.prevent="entrar">
          <p class="campo">
            <label for="l-email">Email</label>
            <input id="l-email" type="email" v-model="email" required autocomplete="username">
          </p>
          <p class="campo">
            <label for="l-pass">Password</label>
            <input id="l-pass" type="password" v-model="password" required autocomplete="current-password" autofocus>
          </p>
          <p v-if="erro" class="msg-erro" role="alert">{{ erro }}</p>
          <button type="submit" class="btn btn-pri largo">Entrar</button>
        </form>
        <footer><small>Protótipo: use a password <code>pwa2026</code></small></footer>
      </section>
    </main>`
}

const Painel = {
  components: { Avatar, Distintivo },
  computed: {
    bd () { return bd },
    totalQuestoes () { return bd.quizzes.reduce((t, q) => t + q.questoes.length, 0) },
    sponsorsAtivos () { return bd.sponsors.filter(s => s.ativo).length },
    familiasCobertas () { return new Set(bd.experts.map(e => e.familia)).size },
    semSponsor () { return bd.animais.filter(a => !bd.sponsors.some(s => s.ativo && s.animais.includes(a.id))) },
    ultimosSponsors () { return [...bd.sponsors].sort((a, b) => b.inicio.localeCompare(a.inicio)).slice(0, 4) }
  },
  methods: {
    nomesAnimais: util.nomesAnimais,
    titulo: util.titulo,
    repor () {
      if (confirm('Repor todos os dados de exemplo? As alterações feitas serão perdidas.')) {
        reporDados(); mostrarAviso('Dados de exemplo repostos.')
      }
    }
  },
  template: `
    <section aria-labelledby="titulo-pagina">
      <header class="cab-pagina">
        <nav class="migalhas" aria-label="Localização">Back-office › Painel</nav>
        <h2 id="titulo-pagina">Painel de administração</h2>
        <p class="subtitulo">Resumo das entidades geridas no back-office</p>
      </header>

      <ul class="cartoes-kpi">
        <li style="--cor: var(--primaria)"><router-link to="/animais"><span>Animais</span><strong>{{ bd.animais.length }}</strong><small>{{ semSponsor.length }} sem patrocinador ativo</small></router-link></li>
        <li style="--cor: #2F4A4A"><router-link to="/utilizadores"><span>Utilizadores</span><strong>{{ bd.utilizadores.length }}</strong><small>registados</small></router-link></li>
        <li style="--cor: #5B5B57"><router-link to="/quizzes"><span>Quizzes</span><strong>{{ bd.quizzes.length }}</strong><small>{{ totalQuestoes }} questões</small></router-link></li>
        <li style="--cor: var(--sponsor)"><router-link to="/sponsors"><span>Sponsors</span><strong>{{ bd.sponsors.length }}</strong><small>{{ sponsorsAtivos }} ativos</small></router-link></li>
        <li style="--cor: var(--expert)"><router-link to="/experts"><span>Experts</span><strong>{{ bd.experts.length }}</strong><small>{{ familiasCobertas }} famílias cobertas</small></router-link></li>
      </ul>

      <p v-if="semSponsor.length" class="alerta" role="status">
        <strong>{{ semSponsor.length }} {{ semSponsor.length === 1 ? 'animal' : 'animais' }} sem patrocinador ativo:</strong>
        <template v-for="(a, i) in semSponsor" :key="a.id">{{ i ? ', ' : ' ' }}<router-link :to="'/animais/' + a.id">{{ a.nome }}</router-link></template>.
        Associe um sponsor para garantir o seu apoio.
      </p>

      <div class="grelha-2">
        <article class="painel">
          <header class="cab-bloco"><h3>Últimos sponsors</h3><router-link to="/sponsors">Ver todos →</router-link></header>
          <ul class="lista-simples">
            <li v-for="s in ultimosSponsors" :key="s.id">
              <avatar :nome="s.nome" :imagem="s.logotipo" :id="s.id" quadrado></avatar>
              <div><strong>{{ s.nome }}</strong><small>{{ nomesAnimais(s.animais) }}</small></div>
              <distintivo :ok="s.ativo">{{ s.ativo ? 'Ativo' : 'Inativo' }}</distintivo>
            </li>
          </ul>
        </article>
        <article class="painel">
          <header class="cab-bloco"><h3>Experts por família</h3><router-link to="/experts">Ver todos →</router-link></header>
          <ul class="lista-simples">
            <li v-for="e in bd.experts.slice(0, 4)" :key="e.id">
              <avatar :nome="e.nome" :imagem="e.fotografia" :id="e.id + 2"></avatar>
              <div><strong>{{ titulo(e) }}</strong><small>{{ e.familia }} · {{ e.instituicao }}</small></div>
            </li>
          </ul>
        </article>
      </div>
      <p class="rodape-tabela"><button type="button" class="btn btn-sec btn-peq" @click="repor">Repor dados de exemplo</button></p>
    </section>`
}

const AnimaisLista = {
  computed: { animais () { return bd.animais } },
  methods: {
    nSponsors (a) { return bd.sponsors.filter(s => s.animais.includes(a.id)).length },
    expert (a) { const e = bd.experts.find(x => x.animais.includes(a.id)); return e ? util.titulo(e) : '—' }
  },
  template: `
    <section aria-labelledby="titulo-pagina">
      <header class="cab-pagina">
        <nav class="migalhas" aria-label="Localização"><router-link to="/painel">Back-office</router-link> › Animais</nav>
        <h2 id="titulo-pagina">Gestão de Animais</h2>
        <p class="subtitulo">Cada animal mostra os seus sponsors e o especialista que o acompanha</p>
      </header>
      <table class="tabela">
        <caption class="sr-only">Lista de animais</caption>
        <thead><tr><th scope="col">Animal</th><th scope="col">Família</th><th scope="col">Estado de conservação</th>
          <th scope="col">Sponsors</th><th scope="col">Expert</th><th scope="col">Ações</th></tr></thead>
        <tbody>
          <tr v-for="a in animais" :key="a.id">
            <td data-label="Animal"><strong>{{ a.nome }}</strong><br><small><i>{{ a.cientifico }}</i></small></td>
            <td data-label="Família">{{ a.familia }}</td>
            <td data-label="Estado">{{ a.estado }}</td>
            <td data-label="Sponsors" class="realce-sponsor">{{ nSponsors(a) }}</td>
            <td data-label="Expert" class="realce-expert">{{ expert(a) }}</td>
            <td data-label="Ações" class="celula-acoes"><router-link :to="'/animais/' + a.id" class="btn btn-sec btn-peq">Ver ficha</router-link></td>
          </tr>
        </tbody>
      </table>
    </section>`
}

const AnimalFicha = {
  components: { Avatar, Distintivo },
  computed: {
    animal () { return crud.obter('animais', this.$route.params.id) },
    sponsors () { return bd.sponsors.filter(s => s.animais.includes(this.animal.id)) },
    experts () { return bd.experts.filter(e => e.animais.includes(this.animal.id)) },
    quizzes () { return bd.quizzes.filter(q => q.animalId === this.animal.id) },
    nQuestoes () { return this.quizzes.reduce((t, q) => t + q.questoes.length, 0) }
  },
  methods: { dataPT: util.dataPT, titulo: util.titulo },
  template: `
    <section v-if="animal" aria-labelledby="titulo-pagina">
      <header class="cab-pagina">
        <nav class="migalhas" aria-label="Localização"><router-link to="/painel">Back-office</router-link> › <router-link to="/animais">Animais</router-link> › {{ animal.nome }}</nav>
        <h2 id="titulo-pagina">{{ animal.nome }}</h2>
        <p class="subtitulo"><i>{{ animal.cientifico }}</i> · {{ animal.familia }}</p>
      </header>
      <div class="grelha-ficha">
        <article class="painel">
          <figure class="foto-animal" :style="{ background: animal.cor }"><figcaption>Fotografia do animal</figcaption></figure>
          <dl class="detalhes">
            <dt>Nome científico</dt><dd><i>{{ animal.cientifico }}</i></dd>
            <dt>Família</dt><dd>{{ animal.familia }}</dd>
            <dt>Habitat</dt><dd>{{ animal.habitat }}</dd>
            <dt>Estado de conservação</dt><dd>{{ animal.estado }}</dd>
            <dt>Quizzes associados</dt><dd>{{ quizzes.length }} {{ quizzes.length === 1 ? 'quiz' : 'quizzes' }} · {{ nQuestoes }} {{ nQuestoes === 1 ? 'questão' : 'questões' }}</dd>
          </dl>
        </article>
        <div class="coluna">
          <section class="painel faixa-sponsor" aria-labelledby="t-sp">
            <header class="cab-bloco">
              <h3 id="t-sp">Sponsors deste animal ({{ sponsors.length }})</h3>
              <router-link :to="{ path: '/sponsors/novo', query: { animal: animal.id } }" class="btn btn-sec btn-peq">+ Associar sponsor</router-link>
            </header>
            <ul class="lista-cartoes">
              <li v-for="s in sponsors" :key="s.id">
                <avatar :nome="s.nome" :imagem="s.logotipo" :id="s.id" quadrado :tamanho="54"></avatar>
                <div>
                  <strong>{{ s.nome }}</strong>
                  <small>{{ s.tipo }} · desde <time :datetime="s.inicio">{{ dataPT(s.inicio) }}</time></small>
                  <a v-if="s.website" :href="s.website" target="_blank" rel="noopener">{{ s.website }}</a>
                </div>
                <distintivo :ok="s.ativo">{{ s.ativo ? 'Ativo' : 'Inativo' }}</distintivo>
              </li>
              <li v-if="!sponsors.length" class="vazio">Este animal ainda não tem patrocinadores.</li>
            </ul>
          </section>
          <section class="painel faixa-expert" aria-labelledby="t-ex">
            <header class="cab-bloco"><h3 id="t-ex">Especialista científico</h3></header>
            <ul class="lista-cartoes">
              <li v-for="e in experts" :key="e.id">
                <avatar :nome="e.nome" :imagem="e.fotografia" :id="e.id + 2" :tamanho="64"></avatar>
                <div>
                  <strong>{{ titulo(e) }}</strong>
                  <small>{{ e.grau }} · Família {{ e.familia }}</small>
                  <small>{{ e.instituicao }}</small>
                  <a :href="'mailto:' + e.email">{{ e.email }}</a>
                </div>
                <router-link :to="'/experts/' + e.id + '/editar'" class="btn btn-sec btn-peq">Ver perfil</router-link>
              </li>
              <li v-if="!experts.length" class="vazio">
                Sem especialista associado. <router-link to="/experts/novo">Adicionar expert</router-link>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </section>
    <section v-else><h2>Animal não encontrado</h2><router-link to="/animais">Voltar aos animais</router-link></section>`
}

const UtilizadoresLista = {
  computed: { utilizadores () { return bd.utilizadores } },
  template: `
    <section aria-labelledby="titulo-pagina">
      <header class="cab-pagina">
        <nav class="migalhas" aria-label="Localização"><router-link to="/painel">Back-office</router-link> › Utilizadores</nav>
        <h2 id="titulo-pagina">Gestão de Utilizadores</h2>
        <p class="subtitulo">Contas registadas na plataforma</p>
      </header>
      <table class="tabela">
        <caption class="sr-only">Lista de utilizadores</caption>
        <thead><tr><th scope="col">Nome</th><th scope="col">Email</th><th scope="col">Tipo</th><th scope="col">Pontos</th></tr></thead>
        <tbody>
          <tr v-for="u in utilizadores" :key="u.id">
            <td data-label="Nome"><strong>{{ u.nome }}</strong></td>
            <td data-label="Email">{{ u.email }}</td>
            <td data-label="Tipo">{{ u.tipo }}</td>
            <td data-label="Pontos">{{ u.pontos }}</td>
          </tr>
        </tbody>
      </table>
    </section>`
}

const QuizzesLista = {
  methods: { nomeAnimal (id) { return (crud.obter('animais', id) || {}).nome || '—' } },
  computed: { quizzes () { return bd.quizzes } },
  template: `
    <section aria-labelledby="titulo-pagina">
      <header class="cab-pagina">
        <nav class="migalhas" aria-label="Localização"><router-link to="/painel">Back-office</router-link> › Quizzes e questões</nav>
        <h2 id="titulo-pagina">Quizzes e questões</h2>
        <p class="subtitulo">Clique num quiz para ver as suas questões</p>
      </header>
      <article v-for="q in quizzes" :key="q.id" class="painel quiz">
        <details>
          <summary><strong>{{ q.titulo }}</strong> <small>· {{ nomeAnimal(q.animalId) }} · {{ q.nivel }} · {{ q.questoes.length }} questões</small></summary>
          <ol>
            <li v-for="(qq, i) in q.questoes" :key="i">{{ qq.texto }}
              <ul><li v-for="(o, j) in qq.opcoes" :key="j" :class="{ correta: j === qq.correta }">{{ o }}<span v-if="j === qq.correta"> ✓</span></li></ul>
            </li>
          </ol>
        </details>
      </article>
    </section>`
}

const NaoEncontrado = {
  template: `<section><h2>Página não encontrada</h2><p><router-link to="/painel">Voltar ao painel</router-link></p></section>`
}
