// ====================================================================
// 1. CONFIGURAÇÃO E ESTADO GLOBAL
// ====================================================================

const SCALES_INFO = {
    prescricao: {
        title: "Sistematização da Assistência de Enfermagem (SAE)",
    }
};

// ====================================================================
// 2. FUNÇÕES DE INTERAÇÃO (BALÕES E SELEÇÃO)
// ====================================================================

function toggleOptions(header) {
    const group = header.closest('.assessment-group');
    const optionsContainer = group.querySelector('.option-container');
    const chevron = header.querySelector('.chevron');
    
    if (optionsContainer.classList.contains('hidden-by-default')) {
        optionsContainer.classList.remove('hidden-by-default');
        if (chevron) chevron.textContent = ' ▼ ';
    } else {
        optionsContainer.classList.add('hidden-by-default');
        if (chevron) chevron.textContent = ' ▶ ';
    }
}

function initializeOptionListeners() {
    document.querySelectorAll('.option-balloon').forEach(balloon => {
        balloon.addEventListener('click', function() {
            const container = this.closest('.option-container');
            const selectId = container.dataset.selectId;
            const selectElement = document.getElementById(selectId);
            const selectedValue = this.dataset.value;

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
    document.getElementById('r_record').textContent = document.getElementById('patientRecord').value || 'Não Informado';

    document.getElementById('result-scale-title').textContent = SCALES_INFO.prescricao.title;
    
    const container = document.getElementById('selectedOptionsContainer');
    container.innerHTML = ''; 

    // GRADE 1: Diagnósticos (Sem horários, campo 50% alinhado à esquerda)
    renderGrade(container, "Diagnósticos de Enfermagem", ["DiagnosticosEnfermagemSelect"], "diagnostico", false);
    
    // GRADE 2: Prescrição (Com horários, largura total)
    const idsPrescricao = ["cuidadosEnfermagemSelect", "prescricaoCirurgicaSelect", "prescricaoPosOperatoriaSelect"];
    renderGrade(container, "Prescrição de Enfermagem", idsPrescricao, "cuidado", true);

    // Exibir Seção de Resultado
    document.getElementById('result').style.display = 'block';
    document.getElementById('result').scrollIntoView({ behavior: 'smooth' });
}

function renderGrade(container, title, selectIds, type, showHour) {
    let items = [];
    selectIds.forEach(id => {
        const select = document.getElementById(id);
        if (select) {
            Array.from(select.selectedOptions).forEach(opt => items.push(opt.textContent.trim()));
        }
    });

    const section = document.createElement('div');
    section.className = "result-section-group";
    section.style.marginBottom = "30px";
    
    section.innerHTML = `<h3 style="margin-top:20px; color:#38a700; border-bottom: 2px solid #38a700; padding-bottom: 5px;">${title}</h3>`;
    
    const grid = document.createElement('div');
    grid.className = 'prescription-grid';

    // Cabeçalhos
    if (showHour) {
        grid.innerHTML = `
            <div class="grid-header-cuidado">Cuidado / Intervenção</div>
            <div class="grid-header-horario">Horários</div>
        `;
    } else {
        grid.innerHTML = `
            <div class="grid-header-cuidado" style="grid-column: span 2; text-align: left; padding-left: 10px;">Diagnóstico Identificado</div>
        `;
    }

    items.forEach(text => {
        addTableRow(grid, text, false, showHour);
    });

    section.appendChild(grid);
    
    // Botão Adicionar Manual
    const btnAdd = document.createElement('button');
    btnAdd.type = "button";
    btnAdd.className = "button no-print";
    btnAdd.style = "margin-top: 10px; background-color: #28a745; font-size: 12px; padding: 6px 12px; cursor: pointer; border: none; border-radius: 4px; color: white;";
    btnAdd.textContent = `+ Adicionar ${type === 'diagnostico' ? 'Diagnóstico' : 'Cuidado'}`;
    btnAdd.onclick = () => addTableRow(grid, '', true, showHour);
    
    section.appendChild(btnAdd);
    container.appendChild(section);
}

function addTableRow(grid, text, isManual, showHour) {
    const divDesc = document.createElement('div');
    divDesc.className = 'grid-item-cuidado';
    
    // Configuração visual para Diagnósticos (campo 50% à esquerda)
    if (!showHour) {
        divDesc.style.gridColumn = "span 2";
        divDesc.style.justifyContent = "flex-start"; 
    }
    
    divDesc.style.display = "flex";
    divDesc.style.alignItems = "center";
    divDesc.style.gap = "10px";
    divDesc.style.paddingLeft = "10px";

    // Botão Excluir (Bolinha Vermelha com X)
    const btnDel = document.createElement('div');
    btnDel.className = 'no-print';
    btnDel.innerHTML = '×';
    btnDel.style = `
        display: flex;
        align-items: center;
        justify-content: center;
        width: 18px;
        height: 18px;
        background-color: #ff4d4d;
        color: white;
        border-radius: 50%;
        cursor: pointer;
        font-size: 14px;
        font-weight: bold;
        flex-shrink: 0;
    `;
    btnDel.title = "Remover linha";

    if (isManual) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = "Digite aqui...";
        input.className = "manual-input";
        
        // Diagnóstico 50% da largura, Cuidado 90%
        input.style.width = showHour ? "90%" : "50%"; 
        
        divDesc.appendChild(btnDel);
        divDesc.appendChild(input);
    } else {
        divDesc.appendChild(btnDel);
        const span = document.createElement('span');
        span.textContent = text;
        divDesc.appendChild(span);
    }

    grid.appendChild(divDesc);

    let divHora = null;
    if (showHour) {
        divHora = document.createElement('div');
        divHora.className = 'grid-item-horario';
        const inputHora = document.createElement('input');
        inputHora.type = 'text';
        inputHora.placeholder = " ";
        divHora.appendChild(inputHora);
        grid.appendChild(divHora);
    }

    // Lógica de remoção
    btnDel.onclick = () => {
        divDesc.remove();
        if (divHora) divHora.remove();
    };

    if (isManual) divDesc.querySelector('input').focus();
}

// ====================================================================
// 4. INICIALIZAÇÃO
// ====================================================================

document.addEventListener('DOMContentLoaded', () => {
    initializeOptionListeners();
    const prescricao = document.getElementById('scale-prescricao');
    if(prescricao) prescricao.style.display = 'block';
});