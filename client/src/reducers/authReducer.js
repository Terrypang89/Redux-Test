const initialState = {
    isAuthenticated: false,
    user: {},
    state: "hello"
};

export default function(state = initialState, action){
    switch(action.type){
        default: 
            return state;
    }
}; 