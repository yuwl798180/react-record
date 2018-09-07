import React from 'react';
import './ThinkInReact.css'

class SearchBar extends React.Component {
  handleFilterTextInput = e => {
    this.props.handleFilterTextInput(e.target.value);
  };

  handleInStockInput = e => {
    this.props.handleInStockInput(e.target.checked);
  };

  render() {
    const {filterText, inStockOnly} = this.props;
    return (
      <form>
        <input
          type="text"
          placeholder="Search..."
          value={filterText}
          onChange={this.handleFilterTextInput}
        />
        <br />
        <input
          type="checkbox"
          name="checkInStock"
          checked={inStockOnly}
          onChange={this.handleInStockInput}
        />
        <label htmlFor="checkInStock">Only show products in stock</label>
      </form>
    );
  }
}

const ProductCategoryRow = props => (
  <tr>
    <th colSpan="2">{props.category}</th>
  </tr>
);

const ProductRow = props => {
  const {name, price, stocked} = props.product;
  const nameColor = stocked ? 'red' : 'black';

  return (
    <tr>
      <td>
        <span style={{color: nameColor}}>{name}</span>
      </td>
      <td>{price}</td>
    </tr>
  );
};

const ProductTable = props => {
  const {products, filterText, inStockOnly} = props;
  const rows = [];
  let lastCategory = null;

  products.forEach(product => {
    if (
      product.name.toLowerCase().indexOf(filterText.toLowerCase()) === -1 ||
      (inStockOnly && !product.stocked)
    ) {
      return;
    }

    product.category !== lastCategory &&
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category}
        />
      );
    rows.push(<ProductRow product={product} key={product.name} />);
    lastCategory = product.category;
  });

  return (
    <table
      style={{
        border: '1px solid',
        margin: '0 auto',
        borderCollapse: 'collapse',
      }}>
      <thead>
        <tr>
          <td>Name</td>
          <td>Price</td>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
};

export default class FilterableProductTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {filterText: '', inStockOnly: false};
  }

  static defaultProps = {
    PRODUCT: [
      {
        category: 'Sporting Goods',
        price: '$49.99',
        stocked: true,
        name: 'Football',
      },
      {
        category: 'Sporting Goods',
        price: '$9.99',
        stocked: true,
        name: 'Baseball',
      },
      {
        category: 'Sporting Goods',
        price: '$29.99',
        stocked: false,
        name: 'Basketball',
      },
      {
        category: 'Electronics',
        price: '$99.99',
        stocked: true,
        name: 'iPod Touch',
      },
      {
        category: 'Electronics',
        price: '$399.99',
        stocked: false,
        name: 'iPhone 5',
      },
      {
        category: 'Electronics',
        price: '$199.99',
        stocked: true,
        name: 'Nexus 7',
      },
    ],
  };

  handleFilterTextInput = filterText => {
    this.setState({filterText});
  };

  handleInStockInput = inStockOnly => {
    this.setState({inStockOnly});
  };

  render() {
    const {filterText, inStockOnly} = this.state;
    const products = this.props.PRODUCT;

    return (
      <React.Fragment>
        <SearchBar
          filterText={filterText}
          inStockOnly={inStockOnly}
          handleFilterTextInput={this.handleFilterTextInput}
          handleInStockInput={this.handleInStockInput}
        />
        <ProductTable
          filterText={filterText}
          inStockOnly={inStockOnly}
          products={products}
        />
      </React.Fragment>
    );
  }
}
