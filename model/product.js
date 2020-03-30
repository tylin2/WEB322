const products=
{
    fakeDB:[],

    init()
    {

        this.fakeDB.push({Name: "Luigi’s Mansion 3",Price: 79.99,Category: "Adventure",
        BestSeller: true, ReleasedDate: "Oct 31, 2019",Players:"up to 8 players"
        ,img:`/img/0.png`});
    
         this. fakeDB.push({Name: "The Legend of Zelda Link's Awakening",Price: 79.99,
         Category: "Adventure",BestSeller: true,ReleasedDate: "Sep 20, 2019",Players:"1 player"
         ,img:`/img/1.png`});
    
        this.fakeDB.push({Name: "The Legend of Zelda Breath of the Wild",Price: 55.99,
        Category: "Adventure",BestSeller: false,ReleasedDate: "Mar 02, 2017",Players:"1 player"
        ,img:`/img/2.png`});

        this.fakeDB.push({Name: "Super Mario Party",Price: 55.99,
        Category: "Party",BestSeller:true,ReleasedDate: "Oct 04, 2018",Players:"up to 4 players"
        ,img:`/img/3.png`});

        this.fakeDB.push({Name: "Overcooked 2",Price: 27.99,
        Category: "Party",BestSeller:false,ReleasedDate: "Aug 06, 2018",Players:"up to 4 players"
        ,img:`/img/4.png`});

        this.fakeDB.push({Name: "Mario Kart 8 Deluxe",Price: 79.99,
        Category: "Sports",BestSeller: false,ReleasedDate: "Apr 27, 2017",Players:"up to 12 players"
        ,img:`/img/5.png`});

        this.fakeDB.push({Name: "Ultimate Chicken Horse",Price: 16.99,
        Category: "Racing",BestSeller: false,ReleasedDate: "Sep 25, 2018",Players:"up to 4 players"
        ,img:`/img/6.png`});

        this.fakeDB.push({Name: "Tricky Towers",Price: 18.89,
        Category: "Racing",BestSeller: false,ReleasedDate: "Oct 11, 2018",Players:"up to 4 players"
        ,img:`/img/7.png`});

        this.fakeDB.push({Name: "Stikbold A Dodgeball Adventure DELUXE",Price: 7.91,
        Category: "Sports",BestSeller: false,ReleasedDate: "Jan 04, 2018",Players:"up to 6 players"
        ,img:`/img/8.png`});

        this.fakeDB.push({Name: "Just Dance 2020",Price: 32.49,
        Category: "Sports",BestSeller: true,ReleasedDate: "Nov 05, 2019",Players:"up to 64 players"
        ,img:`/img/9.png`});

    },

    getAllProducts()
    {

        return this.fakeDB;
    }

}

products.init();
module.exports=products;