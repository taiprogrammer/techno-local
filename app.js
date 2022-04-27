const vm = new Vue({
  el: "#app",
  data() {
    return {
      produtos: new Array(),
      produto: false,
      carrinho: new Array(),
      cart: false,
      mensagemAlerta: "",
      alertaAtivo: false,
    };
  },
  methods: {
    getProducts() {
      fetch("./api/produtos.json")
        .then((produtos) => produtos.json())
        .then((produtos) => {
          this.produtos = produtos;
        });
    },
    getProduto(id) {
      fetch(`./api/${id}/dados.json`)
        .then((produto) => produto.json())
        .then((produto) => {
          this.produto = produto;
        });
      this.scrollToTop();
    },
    closeModal({ target, currentTarget }) {
      if (target === currentTarget) {
        this.produto = false;
      }
    },
    addItem() {
      const toast = document.getElementById("alerta");
      this.mensagemAlerta = "Item adicionado";
      this.produto.estoque--;
      const { id, nome, preco, img, estoque } = this.produto;
      this.carrinho.push({ id, nome, preco, img, estoque });
      toast.classList.add("ativo");
      toast.style.display = "block";
      this.alertaAtivo = true;
      this.scrollToTop();
    },
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
    getCart() {
      this.cart = true;
      this.scrollToTop();
    },
    closeCart() {
      this.cart = false;
    },
    removeItemFromCart(index) {
      const toast = document.getElementById("alerta");
      this.carrinho.splice(index, 1);
      if (this.carrinho.length <= 0) {
        this.cart = false;
      }
      this.mensagemAlerta = "Item excluído";
      toast.classList.add("ativo");
      toast.style.display = "block";
      this.alertaAtivo = true;
      this.scrollToTop();
    },
    checkLocalStorage() {
      if (window.localStorage.carrinho) {
        this.carrinho = JSON.parse(window.localStorage.carrinho);
      }
    },
    closeToast() {
      const toast = document.getElementById("alerta");
      toast.style.display = "none";
    },
  },
  computed: {
    getCartLength() {
      return this.carrinho.length;
    },
    getTotalPrice() {
      const price = this.carrinho.map((item) => item.preco);
      const totalPrice = price.reduce((prev, current) => prev + current, 0);
      return totalPrice;
    },
  },
  created() {
    this.getProducts();
    this.checkLocalStorage();
  },
  watch: {
    carrinho() {
      window.localStorage.carrinho = JSON.stringify(this.carrinho);
    },
  },
  filters: {
    priceNumber(value) {
      return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    },
  },
});
