import './style.css';

export const ListItem = (props) => {
  const { day, item, expanded } = props;
  const { id, done, product, amount, unit } = item;

  let tickClass = '';
  if (done) {
    tickClass = ' btn-tick--on';
  }

  const element = document.createElement('div');
  element.classList.add('list-item');

  if (expanded) {
    element.classList.add('list-item--expanded');
  }

  element.innerHTML = `
    <div class="list-item__toolbar">
      
    </div>
    <button class="icon-btn btn-tick${tickClass}"></button>
    <div class="list-item__body">
      <div class="list-item__product">${product}</div>
      <div class="list-item__amount">${amount} ${unit}</div>
    </div>
    <div class="list-item__detail">
    <form>
      <div class="form-fields">
        <input class="field-input product-input" value="${product}" />
        <input class="field-input amount-input" value="${amount}" />
        <input class="field-input unit-input" value="${unit}" />
      </div>
      <div div class="form-controls">
        <button type="submit" class="btn-confirm">Potvrdit</button>
      </div>
    </form>
    </div>
    <div class="list-item__menu">
      <button class="icon-btn btn-menu ${expanded ? `btn-menu--expanded` : `btn-menu--wrapped`}"></button>
    </div>
  `;

  const handleTick = () => {
    fetch(`https://nakupy.kodim.app/api/me/week/${day}/items/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        done: !done,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        element.replaceWith(
          ListItem(
            { day, item: data.result, expanded: false }
          )
        );
      });
  };

  element.querySelector('.btn-tick').addEventListener('click', handleTick);
  const itemChange = (event) => {
    event.preventDefault()

    fetch(`https://nakupy.kodim.app/api/me/week/${day}/items/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        product: element.querySelector('.product-input').value,
        amount: Number(element.querySelector('.amount-input').value),
        unit: element.querySelector('.unit-input').value,
      }),
    })
      .then(response => response.json())
      .then(data => {
        element.replaceWith(ListItem({
          day: day,
          item: data.result,
          expanded: expanded,
        }))
      })
  }

  element.querySelector("form").addEventListener("submit", itemChange);

  const toggleItemDetail = () => {

    element.replaceWith(ListItem({
      day: day,
      item: item,
      expanded: !expanded,
    }))
  }

  element.querySelector('.btn-menu').addEventListener('click', toggleItemDetail);



  return element;
};


