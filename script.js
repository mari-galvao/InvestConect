document.addEventListener('DOMContentLoaded', function() {
    const tipoCadastro = document.getElementById('tipoCadastro');
    const camposInvestidor = document.getElementById('camposInvestidor');
    const camposEmpresa = document.getElementById('camposEmpresa');

    tipoCadastro.addEventListener('change', function() {
        if (tipoCadastro.value === 'investidor') {
            camposInvestidor.classList.remove('hidden');
            camposEmpresa.classList.add('hidden');
        } else if (tipoCadastro.value === 'empresa') {
            camposEmpresa.classList.remove('hidden');
            camposInvestidor.classList.add('hidden');
        } else {
            camposInvestidor.classList.add('hidden');
            camposEmpresa.classList.add('hidden');
        }
    });
});



