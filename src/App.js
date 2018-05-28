import React, { Component } from 'react';
import { Button, Dialog, Form, Field, Input } from '@icedesign/base';
import logo from './logo.svg';
import './App.css';

const FormItem = Form.Item;

const dataSource = [
];

const uuid = () => {
  /*jshint bitwise:false */
  var i, random;
  var uuid = '';

  for (i = 0; i < 32; i++) {
    random = Math.random() * 16 | 0;
    if (i === 8 || i === 12 || i === 16 || i === 20) {
      uuid += '-';
    }
    uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random))
      .toString(16);
  }

  return uuid;
}

const DappAddress = 'n1pyYXZZTWbFhNdstHBe1TfA4bHNttFdoSG';

class App extends Component {
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      quotes: []
    };

    this.field = new Field(this);
  }

  componentDidMount() {
    let to = DappAddress;
    let value = "0";
    let callFunction = "forEach";
    let callArgs = "[\"300\",\"0\"]";
    var that = this;

    window.nebPay.simulateCall(to, value, callFunction, callArgs, {
      listener: function(response) {
        if(response) {

          if(response.result === "[]") {
            return [];
          } else {
            try {
              let quotes = JSON.parse(response.result)

              that.setState({
                quotes: quotes
              })
            } catch (error) {
            }
          }
        }
      }
    });
  }

  onOpen = () => {
    this.setState({
      visible: true
    });
  }

  onClose = () => {
    this.setState({
      visible: false
    });
  }

  onSubmit = () => {
    const values = this.field.getValues();
    console.log("Values: ", values);

    this.field.validate((errors, values) => {
      if (errors) {
        console.log("Errors in form!!!");
        return;
      }
      
      const reset = this.field.reset;
      const onClose = this.onClose;

      var to = DappAddress;
      var value = "0";
      var callFunction = "save";
      var callArgs = "[\"" + uuid() + "\",\"" + values.author + "\",\"" + values.quote + "\"]";
      
      window.nebPay.call(to, value, callFunction, callArgs, {
        listener: function(resp) {
          reset();
          onClose();
        }
      });

    });

    
  }


  render() {
    const init = this.field.init;

    const formItemLayout = {
      labelCol: {
        fixedSpan: 10
      },
      wrapperCol: {
        span: 14
      }
    };

    return (
      <div
        style={{
          ...styles.wrapper,
          backgroundImage:
            'url(https://img.alicdn.com/tfs/TB1Iw2ZRVXXXXb4aFXXXXXXXXXX-2760-1544.png)',
        }}
      >
        <div style={styles.body}>
          <div style={styles.titleWrapper}>
            <h2 style={styles.title}>iQuotes</h2>
            <blockquote style={{width: '50%', margin: '0 auto'}}>
              <p className='quotation'>Each morning we are born again. What we do today is what matters most.</p>
              <footer className='quote_footer'>– Buddha</footer>
            </blockquote>
          </div>
          <div style={styles.buttons}>
            <Button
              style={styles.primaryButton}
              onClick={this.onOpen}
              type="primary"
            >
              Add Quote
            </Button>
          </div>
        </div>

        <div style={{marginTop: '98px'}}>
          <ul>
            {this.state.quotes.map((item, index) => {
              return (
                <li key={index} style={styles.noticeItem}>
                  <blockquote>
                    <p className='quotation'>{item.quote}</p>
                    <footer className='quote_footer'>{`-  ${item.author}`}</footer>
                  </blockquote>
                </li>
              );
            })}
          </ul>
        </div>

        <Dialog
          visible={this.state.visible}
          onOk={this.onSubmit}
          onCancel={this.onClose}
          onClose={this.onClose}
          title="Quote for today"
          closable="esc,mask,close"
          style={{width: '80%'}}
          language='en-us'
        >
          <Form direction="ver" field={this.field}>
            <FormItem label="Quote " {...formItemLayout} required>
              <Input multiple {...init("quote", {rules: [{ required: true, whitespace: true, message: "Quote is required" }]})} />
            </FormItem>

            <FormItem label="Author " {...formItemLayout} required>
              <Input {...init("author", {rules: [{ required: true, whitespace: true, message: "Author is required" }]})} />
            </FormItem>
          </Form>
        </Dialog>

        <div style={{textAlign: 'center', color: '#999', fontSize: '12px', height: '30px', position: 'fixed', bottom: '0px', left: '49vw'}}>
          Powered by Nebulas
        </div>
      </div>
    );
  }
}

const styles = {
  wrapper: {
    height: 500,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  },
  body: {
  },
  titleWrapper: {
    textAlign: 'center',
    paddingTop: 100,
  },
  title: {
    fontSize: 32,
    color: '#333',
    letterSpacing: '1.94px',
    lineHeight: '48px',
    textAlign: 'center',
  },
  buttons: { textAlign: 'center', marginTop: '60px' },
  primaryButton: {
    height: 50,
    fontSize: 16,
    padding: '0 58px',
    lineHeight: '50px',
    color: '#fff',
  },
  secondaryButton: {
    height: 50,
    fontSize: 16,
    padding: '0 58px',
    lineHeight: '50px',
    marginRight: 20,
    backgroundColor: 'transparent',
    borderColor: '#5485f7',
    color: '#5485f7',
  },
  noticeItem: {
    position: 'relative',
    padding: '12px 0',
    paddingRight: '65px',
    listStyle: 'none',
    borderBottom: '1px solid #F4F4F4',
  },
  noticeTitle: {
    fontSize: '14px',
    color: '#666',
    textDecoration: 'none',
  },
  noticeTag: {
    fontSize: '12px',
    padding: '2px 6px',
    borderRadius: '8px',
    marginLeft: '5px',
  },
  noticeTime: {
    position: 'absolute',
    right: '0px',
    top: '15px',
    fontSize: '12px',
    color: '#999',
  },
};

export default App;
