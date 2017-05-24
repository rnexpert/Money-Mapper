console.disableYellowBox = true;
import React from 'react';
import { connect } from 'react-redux';
import { AppRegistry, Text, View, StyleSheet, Image, TextInput, ListView, ScrollView, TouchableHighlight, Modal } from 'react-native';
import axios from 'axios';
import { Actions } from 'react-native-router-flux';
import { getExpenseData, updateAmount, updateCategorySelected } from '../actions';
import { Button, CardSection, Card } from './common';


class Home extends React.Component {

    componentDidMount() {
        this.props.getExpenseData(this.props.user.token);
    }

    amountChanged(value, mainCategory, rowId, idx, subCategoryName) {
        let newValue = value.substring(1);
        this.props.updateAmount(newValue, mainCategory, rowId, idx, subCategoryName);
    }

    subcategories(subcategories, mainCategory, rowId) {
        let subCategoryRows = subcategories.map((subcategory, idx) => {
            let subCategoryName = Object.keys(subcategory)[0];

            // monthlyBudget needs to be either amount remaining for that category, or amount
            let monthlyBudget = this.props.expenses[rowId][mainCategory].subcategories[idx][subCategoryName].monthlyBudget;
            return (
                <View style={styles.container}>
                    <Text style={styles.subcategory}>{subCategoryName}</Text>
                    {/* <TextInput
                        keyboardType='numeric'
                        value={'$' + monthlyBudget}
                        onChangeText={value => this.amountChanged(value, mainCategory, rowId, idx, subCategoryName)}
                        style={styles.inputText}
                        /> */}
                    <Text style={styles.inputText}>{'$' + monthlyBudget}</Text>
                </View>
            )
        })
        return (subCategoryRows);

    }

    addNew(mainCategory) {
        this.props.updateCategorySelected(mainCategory);
        Actions.addNewSubcategory();
    }

    renderRow(category, sectionId, rowId) {
        let mainCategory = Object.keys(category)[0];
        let mainCategoryBudget = this.props.expenses[rowId][mainCategory].monthlyBudget;
        let subcategories = this.props.expenses[rowId][mainCategory].subcategories;
        return (
            <View>
                <Card>
                    <CardSection style={styles.header}>
                        <View style={styles.container}>
                            <Text style={styles.headerText}>{mainCategory.toUpperCase()}</Text>
                            <Text style={styles.headerText}>${mainCategoryBudget}</Text>
                        </View>
                    </CardSection>

                    {this.subcategories(subcategories, mainCategory, rowId)}

                    {/* <View style={styles.container}>
                        <Text style={styles.add}>Add Item</Text>
                        <TouchableHighlight onPress={()=> this.addNew(mainCategory)}>
                            <Image source={require('./Resources/plus.png')} style={styles.plusIcon} />
                        </TouchableHighlight>
                    </View> */}

                </Card>
            </View>

        )
    }

    render() {
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
        this.dataSource = ds.cloneWithRows(this.props.expenses);
        const totalMonthlyBudget = this.props.expenses.reduce((accum, category) =>{
          return accum + category[Object.keys(category)[0]].subcategories.reduce((accum, subcategory) => {
            return accum + Number(subcategory[Object.keys(subcategory)[0]].monthlyBudget);
          },0);
        },0);

        return (
            <View>
                <ListView
                    dataSource={this.dataSource}
                    renderRow={this.renderRow.bind(this)}
                    renderHeader={()=> (
                        <View style={styles.intro}>
                            <Text style={styles.statusText}>Hello {this.props.user.firstName}!</Text>
                            <Image source={require('./Resources/piggy-bank.png')} style={styles.icon} />

                            <CardSection>
                                <View style={styles.totals}>
                                    <Text style={styles.totalsText}>Your Budget</Text>
                                    <Text style={styles.amountText}>${totalMonthlyBudget.toFixed(2)}</Text>
                                </View>
                            </CardSection>

                            <CardSection>
                                <View style={styles.totals}>
                                    <Text style={styles.totalsText}>Spent</Text>
                                    <Text style={styles.amountText}>$1125.23</Text>
                                </View>
                            </CardSection>

                            <CardSection>
                                <View style={styles.totals}>
                                    <Text style={styles.totalsText}>Remaining</Text>
                                    <Text style={styles.amountText}>$524.77</Text>
                                </View>
                            </CardSection>

                            <View style={styles.separator}></View>

                        </View>
                    )}
                    renderFooter={()=> (
                        <View>
                            <View style={styles.separator}></View>
                        </View>
                    )}
                  />

            </View>
        )
    }
};

const styles = {
    intro: {
        marginTop: 50,
        alignItems: 'center'
    },
    icon: {
        marginTop: 20,
        marginBottom: 30,
        width: 40,
        height: 40,
    },
    plusIcon: {
        width: 20,
        height: 20,
        alignSelf: 'center',
        marginRight: 10,
    },
    separator: {
        height: 20
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    totals: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 25
    },
    totalsText: {
        fontSize: 16,
        fontFamily: 'Avenir',
        alignSelf: 'center',
        paddingLeft: 5,
    },
    amountText: {
        fontSize: 16,
        fontFamily: 'Avenir',
        fontWeight: '600',
        alignSelf: 'center',
        paddingRight: 10,
    },
    lastAmount: {
        paddingBottom: 20,
    },
    inputText: {
        width: 85,
        height: 25,
        marginTop: 10,
        marginBottom: 10,
        fontSize: 15,
        color: 'black',
        textAlign: 'right',
        paddingRight: 10,
        fontFamily: 'Avenir',
    },
    statusText: {
        fontSize: 16,
        fontFamily: 'Avenir',
    },
    header: {
        backgroundColor: '#42f4bf',
        height: 40,
    },
    headerText: {
        fontFamily: 'Avenir',
        color: 'white',
        alignSelf: 'center',
        fontSize: 17,
        fontWeight: '600',
        paddingRight: 10,
    },
    subcategory: {
        fontFamily: 'Avenir',
        paddingLeft: 10,
        fontSize: 15,
        alignSelf: 'center'
    },
    add: {
        fontFamily: 'Avenir',
        padding: 10,
        fontSize: 11,
        alignSelf: 'center',
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
        expenses: state.expenses.expenses
    };
};

export default connect(mapStateToProps, { getExpenseData, updateAmount, updateCategorySelected })(Home);
