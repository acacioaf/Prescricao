// ====================================================================
// 1. CONFIGURAÇÃO E ESTADO GLOBAL
// ====================================================================

const SCALES_INFO = {
    prescricao: {
        title: "Dados do paciente",
        getRiskLevel: () => "Cuidados Registrados"
    }
};

// Como agora só existe a prescrição, ela é a única escala ativa
let activeScale = 'prescricao';

// ====================================================================
// 2. FUNÇÕES DE INTERAÇÃO (ABRIR/FECHAR E SELECIONAR)
// ====================================================================

function toggleOptions(header) {
    const group = header.closest('.assessment-group');
    const optionsContainer = group.querySelector('.option-container');
    const chevron = header.querySelector('.chevron');
    
    if (optionsContainer.classList.contains('hidden-by-default')) {
        optionsContainer.classList.remove('hidden-by-default');
        if (chevron) chevron.textContent = '▼';
    } else {
        optionsContainer.classList.add('hidden-by-default');
        if (chevron) chevron.textContent = '▶';
    }
}

function initializeOptionListeners() {
    document.querySelectorAll('.option-balloon').forEach(balloon => {
        balloon.addEventListener('click', function() {
            const container = this.closest('.option-container');
            const selectId = container.dataset.selectId;
            const selectElement = document.getElementById(selectId);
            const selectedValue = this.dataset.value;

            // Comportamento de Múltipla Seleção (Checkbox)
            this.classList.toggle('selected');

            if (selectElement) {
                Array.from(selectElement.options).forEach(option => {
                    if (option.value === selectedValue) {
                        option.selected = this.classList.contains('selected');
                    }
                });
            }
        });
    });
}

// ====================================================================
// 3. GERAÇÃO DE RESULTADOS
// ====================================================================

function generateResult() {
    // 1. Dados do Paciente
    document.getElementById('r_name').textContent = document.getElementById('patientName').value || 'Não Informado';
    document.getElementById('r_birth').textContent = document.getElementById('patientBirth').value || 'Não Informado';
    document.getElementById('r_mother').textContent = document.getElementById('patientMother').value || 'Não Informado';
    document.getElementById('r_record').textContent = document.getElementById('patientRecord').value || 'Não Informado';
    
    // 2. Título do Resultado
    document.getElementById('result-scale-title').textContent = SCALES_INFO.prescricao.title;
    
    // 3. Processar itens selecionados
    displaySelectedOptions();
    
    // 4. Exibir Seção de Resultado
    document.getElementById('result').style.display = 'block';
    document.getElementById('result').scrollIntoView({ behavior: 'smooth' });
}

function displaySelectedOptions() {
    const container = document.getElementById('selectedOptionsContainer');
    container.innerHTML = '<h3 style="margin-top:20px;">Prescrição de Enfermagem</h3>';
    
    const scaleSection = document.getElementById('scale-prescricao');
    const allSelectedItems = [];
    
    // Coleta todos os itens selecionados nos 3 grupos (Cuidados, Cirúrgico, Pós-Op)
    scaleSection.querySelectorAll('.assessment-group').forEach(group => {
        const select = group.querySelector('select');
        if (select && select.hasAttribute('multiple')) {
            Array.from(select.selectedOptions).forEach(option => {
                allSelectedItems.push({
                    text: option.textContent.trim(),
                    value: option.value
                });
            });
        }
    });

    if (allSelectedItems.length > 0) {
        const gridContainer = document.createElement('div');
        gridContainer.className = 'prescription-grid';
        
        // Cabeçalhos
        const h1 = document.createElement('div'); h1.className = 'grid-header-cuidado'; h1.textContent = 'Cuidado';
        const h2 = document.createElement('div'); h2.className = 'grid-header-horario'; h2.textContent = 'Horários';
        gridContainer.appendChild(h1);
        gridContainer.appendChild(h2);

        // Linhas de cuidados
        allSelectedItems.forEach(item => {
            const divCuidado = document.createElement('div');
            divCuidado.className = 'grid-item-cuidado';
            divCuidado.textContent = item.text;

            const divHorario = document.createElement('div');
            divHorario.className = 'grid-item-horario';
            const input = document.createElement('input');
            input.type = 'text';
            divHorario.appendChild(input);

            gridContainer.appendChild(divCuidado);
            gridContainer.appendChild(divHorario);
        });

        container.appendChild(gridContainer);
    } else {
        container.innerHTML += '<p>Nenhum cuidado selecionado.</p>';
    }
}

// ====================================================================
// 4. INICIALIZAÇÃO
// ====================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Inicializa os cliques nos balões
    initializeOptionListeners();
    
    // Força a exibição da seção de prescrição (já que as outras sumiram)
    const prescricao = document.getElementById('scale-prescricao');
    if(prescricao) prescricao.style.display = 'block';
});