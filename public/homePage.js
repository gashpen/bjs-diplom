"use strict"
const logoutButton = new LogoutButton();
logoutButton.action = () =>{
    const callback = (response) =>{
        if(response.success){
            location.reload();
        }
    }
    ApiConnector.logout(callback);
}
    ApiConnector.current((response)=>{
        if(response.success){
            ProfileWidget.showProfile(response.data);
        }
    })

const ratesBoard = new RatesBoard();

function exchangeRate(){
    ApiConnector.getStocks((response) =>{
        if(response.success){
            ratesBoard.clearTable();
            ratesBoard.fillTable(response.data);
        }
    })
    
}

setInterval(()=>{
    exchangeRate()
},60000);

const moneyManager = new MoneyManager();

moneyManager.addMoneyCallback = (data) =>{
    const {currency, amount} = data;
    const callback = (response) =>{
        if(response.success){
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage();
        }
    }
    ApiConnector.addMoney({ currency, amount }, callback);
}

moneyManager.conversionMoneyCallback = (data)=>{
    const {fromCurrency, targetCurrency, fromAmount} = data;
    const callback = (response) =>{
        if(response.success){
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage();
        }
    }
    ApiConnector.convertMoney({ fromCurrency, targetCurrency, fromAmount }, callback);
}

moneyManager.sendMoneyCallback = (data) =>{
    const {to, currency, amount} = data;
    const callback = (response) =>{
        if(response.success){
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage();
        }
  }
  ApiConnector.transferMoney({ to, currency, amount }, callback);
}

const favoritesWidget = new FavoritesWidget();

const callback = (response) =>{
    if(response.success){
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(response.data);
        moneyManager.updateUsersList(response.data);
    }
}

ApiConnector.getFavorites(callback);

favoritesWidget.addUserCallback = (data)=>{
    const {id, name} = data;
    const callback = (response) =>{
        if(response.success){
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            moneyManager.setMessage();            
        }
}
ApiConnector.addUserToFavorites({id, name}, callback);
}

favoritesWidget.removeUserCallback = (data)=>{
    const id = data;
    const callback = (response) =>{
        if(response.success){
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            moneyManager.setMessage();          
        }
}
ApiConnector.removeUserFromFavorites(id, callback);
}