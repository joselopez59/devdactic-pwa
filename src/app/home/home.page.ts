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

const OFERTA_ID_QUERY = gql`
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
  eventos: any[] = [];
  evento: any = '';

  private query: QueryRef<any>;
  private queryOferta: QueryRef<any>;

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


  getEventos() {

    console.log('getEventos');
    const eventosQuery: QueryRef<any> = this.apollo.watchQuery({
      query: gql`
        query {
          eventos {
            id
            title
            descr
            startTime
            endTime
          }
        }
      `
    });

    eventosQuery.valueChanges.subscribe(result => {
      this.eventos = result.data && result.data.eventos;
      console.log('result.data)', result.data);
      // console.log('result.data.eventos)', result.data.eventos);
      console.log('getEventos', this.eventos);
    });
  }


  displayEvento(id: string) {

    console.log('displayEvento id', id);

    const eventoQuery: QueryRef<any> = this.apollo.watchQuery({
      query: gql`
      query ($ide: ID!)
      {
        evento(where: {id: $ide} ) {
          id
          titulo
        }
      }
      `,
      variables: {
        ide: id
      }
    });

    eventoQuery.valueChanges.subscribe(result => {
      // this.evento = result.data && result.data.eventos;
      console.log('result.data)', result.data.evento);
      // console.log('result.data.eventos)', result.data.eventos);
      // console.log('getEventos', this.eventos);
    });
  }

  getOfertas() {

    this.query = this.apollo.watchQuery({
      query: gql`
        query {
          ofertas {
            nombre
            imagen {
              id
              url
            }
          }
        }
      `,
      variables: {}
    });

    this.query.valueChanges.subscribe(result => {
      this.ofertas = result.data && result.data.ofertas;
      // console.log('result', result.data);
      console.log('getOfertas', this.ofertas);
    });
  }

  getOferta() {
    this.queryOferta = this.apollo.watchQuery({
      query: gql`
      query ($ide: ID!)
      {
        evento(where: {id: $ide} ) {
          id
          titulo
        }
      }
      `,
      variables: {
        ide: 'ckk5bps0gbbjv0906xb6vz7fk'
      }
    });

    this.queryOferta.valueChanges.subscribe(result => {
      // this.ofertas = result.data && result.data.ofertas;
      console.log('result', result.data);
      // console.log('getOfertas', this.ofertas);
    });
  }

}
