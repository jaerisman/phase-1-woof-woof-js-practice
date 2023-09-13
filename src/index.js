document.addEventListener('DOMContentLoaded', function(){
    fetch('http://localhost:3000/pups')
        .then(response => response.json())
        .then(data => {
            const dogBar = document.getElementById('dog-bar');
            const dogInfo = document.getElementById('dog-info');
            const filterButton = document.getElementById('filter-btn');
            let isFilterOn = false;

            filterButton.addEventListener('click', () => {
                isFilterOn = !isFilterOn;
                filterButton.textContent = isFilterOn ? 'Filter good dogs: ON' : 'Filter good dogs: OFF';
                filterDogBar(); 
            });
            
            data.forEach(pup => {
                const span = document.createElement('span');
                span.textContent = pup.name;
                span.addEventListener('click', () => {
                    showPupInfo(pup);
                });
                dogBar.appendChild(span);
            });

            function filterDogBar() {
                const spans = dogBar.getElementsByTagName('span');
                for (let i = 0; i < spans.length; i++) {
                    const span = spans[i];
                    const pup = data[i];
                    if (isFilterOn && !pup.isGoodDog) {
                        span.style.display = 'none'
                    } else {
                        span.style.display = 'inline-block';
                    }
                }
            }

            function showPupInfo(pup) {
                while (dogInfo.firstChild){
                    dogInfo.firstChild.remove();
                }
                const img = document.createElement('img');
                img.src = pup.image;
                dogInfo.appendChild(img);

                const name = document.createElement('h2');
                name.textContent = pup.name;
                dogInfo.appendChild(name);

                const button = document.createElement('button');
                button.textContent = pup.isGoodDog ? 'Good Dog!' : 'Bad Dog!';
                button.addEventListener('click', () => {
                    toggleGoodDogStatus(pup, button);
                });
                dogInfo.appendChild(button);
            }

            function toggleGoodDogStatus(pup, button){
                const newStatus = !pup.isGoodDog;
                button.textContent = newStatus ? 'Good Dog!' : 'Rascal!';
                
                pup.isGoodDog = newStatus;

                fetch(`http://localhost:3000/pups/${pup.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json' 
                    },
                    body: JSON.stringify({
                        isGoodDog: newStatus
                    })
                })
                .then(response => response.json())
                .then(updatedPup => {

                })
                .catch(error => {
                    console.error('Error:', error);
                })
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });