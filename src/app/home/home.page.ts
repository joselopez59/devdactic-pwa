import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Apollo, QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';

import { Plugins } from '@capacitor/core';

const { Network } = Plugins;

const OFERTAS_QUERY = gql`
    query {
      ofertas {
        nombre
        imagen {
          id
          url
        }
      }
    }
  `;
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit {

  users = [];
  joke = null;
  appIsOnline = true;
  ofertas: any[] = [];
  private query: QueryRef<any>;

  constructor(
    private http: HttpClient,
    private apollo: Apollo
  ) { }

  async ngOnInit() {
    const status = await Network.getStatus();
    this.appIsOnline = status.connected;

    // tslint:disable-next-line: no-shadowed-variable
    Network.addListener('networkStatusChange', (status) => {
      this.appIsOnline = status.connected;
    });

  }

  getData() {
    this.http.get('https://randomuser.me/api/?results=5').subscribe(result => {
      console.log('results: ', result);
      // tslint:disable-next-line: no-string-literal
      this.users = result['results'];
    });
  }

  getOnlineData() {
    this.http.get('https://api.chucknorris.io/jokes/random').subscribe(result => {
      console.log('joke result: ', result);
      this.joke = result;
    });
  }

  getOfertas() {

    this.query = this.apollo.watchQuery({
      query: OFERTAS_QUERY,
      variables: {}
    });

    this.query.valueChanges.subscribe(result => {
      this.ofertas = result.data && result.data.ofertas;
      console.log('result', result.data);
      console.log('getOfertas', this.ofertas);
    });

    // this.apollo.watchQuery({
    //   query: this.OFERTAS_QUERY
    // }).valueChanges.subscribe((response) => {
    //   this.ofertas = response.data;
    //   console.log('data', response);
    //   console.log('getOfertas', this.ofertas);
    // });
  }
  // getEventos() {
  //   this.http.get('http://h2522373.stratoserver.net:1337/eventos').subscribe(result => {
  //     console.log('getEventos', result);
  //     this.eventos = result;
  //   });
  // }
}
