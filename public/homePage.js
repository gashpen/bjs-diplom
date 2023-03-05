"use strict"
const logoutButton = new LogoutButton();
logoutButton.action = (callback = (response) =>{
    if(response.success){
        location.reload();
    }
}) =>{
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
exchangeRate()
setInterval(()=>{
    exchangeRate()
},60000);

const moneyManager = new MoneyManager();

moneyManager.addMoneyCallback = ({currency, amount} = data, callback = (response) =>{
    if(response.success){
        ProfileWidget.showProfile(response.data);
        moneyManager.setMessage(response.success, "Счет успешно пополнен!");
    } else {
        moneyManager.setMessage(response.success, "Не удалось пополнить счет!")
    }
}) =>{
    ApiConnector.addMoney({ currency, amount }, callback);
}

moneyManager.conversionMoneyCallback = ({fromCurrency, targetCurrency, fromAmount} = data, callback = (response) =>{
    if(response.success){
        ProfileWidget.showProfile(response.data);
        moneyManager.setMessage(response.success,"Средства успешно конвертированны!");
    } else {
        moneyManager.setMessage(response.success,"Не удалось конвертировать средства!");
    }
})=>{
    ApiConnector.convertMoney({ fromCurrency, targetCurrency, fromAmount }, callback);
}

moneyManager.sendMoneyCallback = ({to, currency, amount} = data,callback = (response) =>{
    if(response.success){
        ProfileWidget.showProfile(response.data);
        moneyManager.setMessage(response.success, "Средства успешно переведены пользователю!");
    } else {
        moneyManager.setMessage(response.success, "Пользователя не существует или недостаточно средств")
    }
}) =>{
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

favoritesWidget.addUserCallback = ({id, name} = data,callback = (response) =>{
    if(response.success){
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(response.data);
        moneyManager.updateUsersList(response.data);
        moneyManager.setMessage(response.success, "Пользователь успешно добавлен!");            
    }
})=>{
ApiConnector.addUserToFavorites({id, name}, callback);
}

favoritesWidget.removeUserCallback = (id = data,callback = (response) =>{
    if(response.success){
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(response.data);
        moneyManager.updateUsersList(response.data);
        favoritesWidget.setMessage(response.success, "Пользователь удален!");          
    }
})=>{
ApiConnector.removeUserFromFavorites(id, callback);
}