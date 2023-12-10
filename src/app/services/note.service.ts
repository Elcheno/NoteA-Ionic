import { Injectable, inject } from '@angular/core';
import { DocumentReference, AngularFirestoreCollection, AngularFirestore, Query } from '@angular/fire/compat/firestore'
import { collectionData, collection, Firestore, CollectionReference, DocumentData } from '@angular/fire/firestore'
import { environment } from 'src/environments/environment';
import { Note } from '../model/note';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  myCollection: AngularFirestoreCollection<any>;
  myCollection_new: CollectionReference<DocumentData, DocumentData>;
  private fireStore: AngularFirestore = inject(AngularFirestore); //old
  private fire: Firestore = inject(Firestore);  //new
  public notes$!:Observable<Note[]>;

  constructor() {
    this.myCollection = this.fireStore.collection<any>(environment.firebaseConfig.collectionName);//old



    this.myCollection_new = collection(this.fire, environment.firebaseConfig.collectionName);//new
    //new
    this.notes$ = collectionData(this.myCollection_new,{idField: 'key'}) as Observable<Note[]>;
    
  }
  addNote(note: Note): Promise<DocumentReference> {
    return this.myCollection.add(note);
  }
  
  readAll(): Observable<any> {
    return this.myCollection.get();
  }

  readPaginate(lastNoteDate: string) {
    return this.fireStore.collection(environment.firebaseConfig.collectionName, ref => {
      let query : CollectionReference | Query = ref;
      query = query.orderBy('date', 'desc');
      if (lastNoteDate) query = query.startAfter(lastNoteDate);
      query = query.limit(16);
      return query;
    }).valueChanges({idField: 'key'}) as Observable<Note[]>;
  }
  
  readNote(key: string): Observable<any> {
    return this.myCollection.doc(key).get();
  }

  updateNote(note: Note): Promise<void> {
    return new Promise(async (resolve, reject) => {
      if (!note.key) reject("Key not defined");
      const { key, ...data } = note;
      try {
        resolve(await this.myCollection.doc(note.key).set(data));
      } catch (err) {
        reject(err);
      }
    })
  }

  deleteNote(note:Note):Promise<void>{
    return new Promise(async (resolve,reject)=>{
      if (!note.key) reject("Key not defined");
      try{
        resolve(await this.myCollection.doc(note.key).delete());
      }catch(err) {
        reject(err);
      }
    });
  }

}
