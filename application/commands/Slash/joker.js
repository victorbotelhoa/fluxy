import { SlashService } from "disfox";

const c = new SlashService.Command("piadista")
    .description("Fornece uma piada aleatória.")
    .action(async (interaction) => {
        const piadas = [
            "Por que o JavaScript foi ao terapeuta? Porque tinha muitos problemas de escopo!",
            "Como o programador se declara? 'Sem você, meu mundo é null.'",
            "O que o zero disse para o oito? Belo cinto!",
            "Por que o gato entrou no computador? Para ficar em cima do teclado.",
            "Qual o cúmulo da lentidão? Dormir de capacete para sonhar seguro.",
            "Por que o pão não entende a piada? Porque ele é francês.",
            "O que o tomate disse para o outro no meio da rua? Não olha agora, mas estamos sendo esmagados.",
            "Por que o jacaré tirou o filho da escola? Porque ele réptil de ano.",
            "Sabe por que o livro de matemática se suicidou? Porque ele tinha muitos problemas.",
            "O que é um pontinho vermelho no canto da sala? Uma formiga com vergonha.",
            "O que acontece quando chove na Inglaterra? Molha tudo, ué.",
            "Por que a abelha sempre é promovida? Porque ela é uma excelente funcionÁpia!",
            "Como se chama um boi que toca piano? Boi-linista.",
            "O que o código disse quando deu erro? 'De novo não…'",
            "Qual é o animal mais antigo do mundo? A zebra, porque é preta e branca.",
            "Como se chama um peixe que caiu de paraquedas? Aaaaaaaa-tum!",
            "O que é um vegetariano que come carne escondido? Um ninja-gado.",
            "Por que o peixe caiu do céu? Porque estava chovendo atum.",
            "O que o pato disse para a pata? Vem quá!",
            "Por que o cachorro não gosta de celular? Porque ele prefere o latido ao toque."
        ];

        const randomFact = piadas[Math.floor(Math.random() * piadas.length)];

        await interaction.reply(`${randomFact} 🤣`);
    });

export default c;